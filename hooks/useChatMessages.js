// NOME DO ARQUIVO: hooks/useChatMessages.js
// REFACTOR: Hook customizado para gerenciar o estado e as interações com as mensagens do chat no Firestore.

import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useChatMessages = ({ chatStatus, isMuted, isMinimized, popupsEnabled, notificationSound }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const sessionStartTimeRef = useRef(null);

    // Efeito para buscar e ouvir novas mensagens
    useEffect(() => {
        if (chatStatus === 'online' && !sessionStartTimeRef.current) {
            sessionStartTimeRef.current = new Date();
        }

        if (chatStatus === 'offline') {
            sessionStartTimeRef.current = null;
            setMessages([]);
            return;
        }

        if (!user) return;

        let lastMessageTimestamp = null;

        const q = query(
            collection(db, "chatMessages"),
            where("timestamp", ">=", sessionStartTimeRef.current || new Date()),
            orderBy("timestamp", "asc")
        );

        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const lastMessage = msgs[msgs.length - 1];
            if (lastMessage && lastMessage.timestamp && (!lastMessageTimestamp || lastMessage.timestamp > lastMessageTimestamp)) {
                lastMessageTimestamp = lastMessage.timestamp;
                if (lastMessage.uid !== user.uid) {
                    // Lógica de notificação
                    if (!isMuted && notificationSound.current && window.Tone) {
                        notificationSound.current.triggerAttackRelease("G5", "8n", window.Tone.now());
                    }
                    if (isMinimized && popupsEnabled) {
                        setNewNotification(lastMessage);
                        setTimeout(() => setNewNotification(null), 5000);
                    }
                }
            }
            setMessages(msgs);
        });

        return () => unsubscribeMsg();
    }, [chatStatus, user, isMuted, isMinimized, popupsEnabled, notificationSound]);

    const sendMessage = async (text, isAiSelected) => {
        if (text.trim() === '') return;
        setIsLoading(true);

        try {
            const messageData = { text, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp(), isDeleted: false, editedAt: null };
            await addDoc(collection(db, "chatMessages"), messageData);

            if (isAiSelected) {
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${text}"`;
                const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erro na API do Gemini');
                await addDoc(collection(db, "chatMessages"), { text: data.text || "Não consegui processar a resposta.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            }
        } catch (error) {
            console.error("Erro ao interagir com a IA ou enviar mensagem:", error);
            await addDoc(collection(db, "chatMessages"), { text: `Ocorreu um erro: ${error.message}. Tente novamente.`, uid: 'ai-assistant', name: 'Sistema', role: 'ai', timestamp: serverTimestamp() });
        } finally {
            setIsLoading(false);
        }
    };

    const updateMessage = async (messageId, newText) => {
        const messageRef = doc(db, "chatMessages", messageId);
        await updateDoc(messageRef, { text: newText, editedAt: serverTimestamp() });
    };

    const deleteMessage = async (messageId) => {
        const messageRef = doc(db, "chatMessages", messageId);
        await updateDoc(messageRef, { text: "Esta mensagem foi apagada.", isDeleted: true });
    };

    return { messages, isLoading, newNotification, sendMessage, updateMessage, deleteMessage };
};
