// NOME DO ARQUIVO: components/hooks/useChatManager.js
// Este "hook" personalizado centraliza toda a lógica de gestão do chat,
// tornando o componente principal (GlobalChat.js) mais limpo e focado na UI.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, rtdb } from '../../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";

export const useChatManager = (isVisible, isMinimized) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const [popupsEnabled, setPopupsEnabled] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const notificationSound = useRef(null);

    // Efeito para carregar o Tone.js e inicializar o som
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js';
        script.async = true;
        script.onload = () => {
            const startAudio = () => {
                if (window.Tone && window.Tone.start) {
                    window.Tone.start();
                    notificationSound.current = new window.Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }).toDestination();
                    document.body.removeEventListener('click', startAudio);
                }
            };
            document.body.addEventListener('click', startAudio);
        };
        document.body.appendChild(script);
        return () => { if (script.parentNode) { document.body.removeChild(script); }};
    }, []);

    // Efeito para buscar mensagens e utilizadores online
    useEffect(() => {
        if (!isVisible || !user) return;

        let lastMessageTimestamp = null;

        const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            let hasNewMessage = false;
            querySnapshot.forEach((doc) => {
                const msgData = { id: doc.id, ...doc.data() };
                msgs.push(msgData);
                if (msgData.timestamp && (!lastMessageTimestamp || msgData.timestamp > lastMessageTimestamp)) {
                    hasNewMessage = true;
                    lastMessageTimestamp = msgData.timestamp;
                }
            });

            const lastMessage = msgs[msgs.length - 1];
            if (hasNewMessage && lastMessage && lastMessage.uid !== user.uid) {
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

        const statusRef = ref(rtdb, '/status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val();
            const online = [];
            if (statuses) {
                for (const uid in statuses) {
                    if (statuses[uid].state === 'online' || statuses[uid].state === 'busy') {
                        online.push({ uid, ...statuses[uid] });
                    }
                }
            }
            setOnlineUsers(online);
        });

        return () => {
            unsubscribeMsg();
            unsubscribeStatus();
        };
    }, [isVisible, isMinimized, popupsEnabled, user, isMuted]);
    
    // Função para enviar mensagem, agora usando useCallback para otimização
    const handleSendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        setIsLoading(true);
        const textToSend = newMessage;
        setNewMessage('');

        try {
            if (isAiSelected) {
                // Mensagem do utilizador para a IA
                await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
                
                // Pedido à API do Gemini
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${textToSend}"`;
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro na API do Gemini');
                }

                // Mensagem de resposta da IA
                await addDoc(collection(db, "chatMessages"), { text: data.text || "Não consegui processar a resposta.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            } else {
                // Mensagem normal de utilizador para utilizador
                await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
            }
        } catch (error) {
            console.error("Erro ao interagir com a IA ou enviar mensagem:", error);
            // Mensagem de erro do sistema
            await addDoc(collection(db, "chatMessages"), { text: `Ocorreu um erro: ${error.message}. Tente novamente.`, uid: 'ai-assistant', name: 'Sistema', role: 'ai', timestamp: serverTimestamp() });
        } finally {
            setIsLoading(false);
        }
    }, [newMessage, isAiSelected, user]);

    return {
        user,
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        isAiSelected,
        setIsAiSelected,
        isLoading,
        newNotification,
        setNewNotification,
        popupsEnabled,
        setPopupsEnabled,
        isMuted,
        setIsMuted,
        handleSendMessage,
    };
};

