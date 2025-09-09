// NOME DO ARQUIVO: hooks/useChatManager.js
// REFACTOR: Este hook agora centraliza toda a lógica do chat, incluindo a gestão de mensagens e utilizadores online,
// simplificando o componente GlobalChat.

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";

const useChatManager = (isMinimized, popupsEnabled, isMuted, notificationSound) => {
    const { user, chatStatus } = useAuth();
    
    // Estados geridos pelo hook
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const sessionStartTimeRef = useRef(null);

    // Efeito para buscar mensagens e utilizadores
    useEffect(() => {
        if (chatStatus === 'online' && !sessionStartTimeRef.current) {
            sessionStartTimeRef.current = new Date();
        } else if (chatStatus === 'offline') {
            sessionStartTimeRef.current = null;
            setMessages([]);
            return;
        }

        if (!user) return;

        // Listener para mensagens do Firestore
        const q = query(
            collection(db, "chatMessages"), 
            where("timestamp", ">=", sessionStartTimeRef.current || new Date()),
            orderBy("timestamp", "asc")
        );
        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const lastMessage = msgs[msgs.length - 1];
            if (lastMessage && lastMessage.uid !== user.uid) {
                if (!isMuted && notificationSound.current && window.Tone) {
                    notificationSound.current.triggerAttackRelease("G5", "8n", window.Tone.now());
                }
                if (isMinimized && popupsEnabled) {
                    setNewNotification(lastMessage);
                    setTimeout(() => setNewNotification(null), 5000);
                }
            }
            setMessages(msgs);
        });

        // Listener para status de utilizadores do RealtimeDB
        const statusRef = ref(rtdb, '/status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val() || {};
            const online = Object.keys(statuses)
                .filter(uid => statuses[uid].state === 'online' || statuses[uid].state === 'busy')
                .map(uid => ({ uid, ...statuses[uid] }));
            setOnlineUsers(online);
        });

        return () => {
            unsubscribeMsg();
            unsubscribeStatus();
        };
    }, [chatStatus, user, isMinimized, popupsEnabled, isMuted, notificationSound]);
    
    // Funções de interação com o chat
    const sendMessage = useCallback(async (text, isAiSelected) => {
        if (text.trim() === '' || !user) return;
        setIsLoading(true);

        try {
            await addDoc(collection(db, "chatMessages"), { text, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp(), isDeleted: false, editedAt: null });
            if (isAiSelected) {
                const prompt = `Você é um assistente virtual da Equipe de Triunfo. Responda à pergunta: "${text}"`;
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
    }, [user]);

    const updateMessage = useCallback(async (messageId, newText) => {
        const messageRef = doc(db, "chatMessages", messageId);
        await updateDoc(messageRef, { text: newText, editedAt: serverTimestamp() });
    }, []);

    const deleteMessage = useCallback(async (messageId) => {
        const messageRef = doc(db, "chatMessages", messageId);
        await updateDoc(messageRef, { text: "Esta mensagem foi apagada.", isDeleted: true });
    }, []);


    return {
        messages,
        onlineUsers,
        isLoading,
        newNotification,
        sendMessage,
        updateMessage,
        deleteMessage,
    };
};

export default useChatManager;
