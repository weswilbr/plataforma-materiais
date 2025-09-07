// NOME DO ARQUIVO: components/hooks/useChatManager.js
// Este hook personalizado contém toda a lógica para gerir o estado e as interações do chat.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, rtdb } from '../../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";

const useChatManager = () => {
    const { user, chatStatus } = useAuth();
    
    // Estados geridos pelo hook
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const [popupsEnabled, setPopupsEnabled] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Efeitos para listeners do Firebase
    useEffect(() => {
        if (chatStatus === 'offline' || !user) return;

        const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const lastMessage = msgs[msgs.length - 1];
            if (lastMessage && lastMessage.uid !== user.uid) {
                if (isMinimized && popupsEnabled) {
                    setNewNotification(lastMessage);
                    setTimeout(() => setNewNotification(null), 5000);
                }
            }
            setMessages(msgs);
        });

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
    }, [chatStatus, user, isMinimized, popupsEnabled]);

    // Função para enviar mensagens
    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        setIsLoading(true);
        const textToSend = newMessage;
        setNewMessage('');

        try {
            await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });

            if (isAiSelected) {
                const prompt = `Você é um assistente virtual da Equipe de Triunfo. Responda à pergunta: "${textToSend}"`;
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
    }, [newMessage, user, isAiSelected]);

    // Retorna todos os estados e funções para o componente
    return {
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        isAiSelected,
        setIsAiSelected,
        isLoading,
        isMinimized,
        setIsMinimized,
        newNotification,
        popupsEnabled,
        setPopupsEnabled,
        isMuted,
        setIsMuted,
        handleSendMessage,
    };
};

export default useChatManager;

