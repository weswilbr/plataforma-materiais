// NOME DO ARQUIVO: hooks/useChatMessages.js
// RESPONSABILIDADE: Gerencia o estado e as interações com as mensagens do chat no Firestore.
// APRIMORAMENTO: Adicionado gerenciamento do contador de mensagens não lidas.

import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useChatMessages = ({ chatStatus, isMuted, isMinimized, popupsEnabled, notificationSound }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const sessionStartTimeRef = useRef(new Date()); // Inicia com a data atual para evitar carregar histórico antigo
    const lastReadTimestampRef = useRef(new Date());

    // Efeito para buscar e ouvir novas mensagens
    useEffect(() => {
        if (chatStatus === 'offline') {
            setMessages([]);
            return;
        }

        if (!user) return;

        const q = query(
            collection(db, "chatMessages"),
            where("timestamp", ">=", sessionStartTimeRef.current),
            orderBy("timestamp", "asc")
        );

        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Lógica de notificação apenas para novas mensagens
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const newMessage = { id: change.doc.id, ...change.doc.data() };
                    if (newMessage.uid !== user.uid && newMessage.timestamp?.toDate() > lastReadTimestampRef.current) {
                        if (!isMuted && notificationSound.current && window.Tone) {
                            notificationSound.current.triggerAttackRelease("G5", "8n", window.Tone.now());
                        }
                        if (isMinimized) {
                            setUnreadCount(prev => prev + 1);
                            if (popupsEnabled) {
                                setNewNotification(newMessage);
                            }
                        }
                    }
                }
            });

            setMessages(msgs);
        });

        return () => unsubscribeMsg();
    }, [chatStatus, user, isMuted, isMinimized, popupsEnabled, notificationSound]);
    
    // Função para zerar o contador quando o chat é aberto
    const resetUnreadCount = useCallback(() => {
        if (unreadCount > 0) {
            setUnreadCount(0);
        }
        lastReadTimestampRef.current = new Date();
    }, [unreadCount]);

    const sendMessage = async (text, isAiSelected) => {
        if (text.trim() === '' || !user) return;
        setIsLoading(true);

        try {
            const messageData = { text, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp(), isDeleted: false, editedAt: null };
            await addDoc(collection(db, "chatMessages"), messageData);

            if (isAiSelected) {
                const prompt = `Você é um assistente virtual da 4Life. Responda à pergunta: "${text}"`;
                const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Erro na API');
                await addDoc(collection(db, "chatMessages"), { text: data.text, uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            await addDoc(collection(db, "chatMessages"), { text: `Ocorreu um erro: ${error.message}.`, uid: 'ai-assistant', name: 'Sistema', role: 'ai', timestamp: serverTimestamp() });
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

    return { messages, isLoading, newNotification, unreadCount, resetUnreadCount, sendMessage, updateMessage, deleteMessage };
};