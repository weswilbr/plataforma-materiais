// NOME DO ARQUIVO: components/GlobalChat.js
// Versão atualizada para que o histórico de mensagens funcione como o WhatsApp,
// mostrando apenas as mensagens da sessão atual.

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, where } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";
import ChatHeader from './chat/ChatHeader';
import ChatBody from './chat/ChatBody';
import ChatInput from './chat/ChatInput';
import MinimizedChat from './chat/MinimizedChat';

const GlobalChat = ({ isVisible, onClose }) => {
    const { user, chatStatus, updateUserChatStatus } = useAuth();
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatSize, setChatSize] = useState('normal'); // 'normal' ou 'maximized'
    const [newNotification, setNewNotification] = useState(null);
    const [popupsEnabled, setPopupsEnabled] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const messagesEndRef = useRef(null);
    const notificationSound = useRef(null);
    const sessionStartTimeRef = useRef(null); // Ref para guardar o início da sessão

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
        // Comportamento de histórico tipo WhatsApp
        if (chatStatus === 'online' && !sessionStartTimeRef.current) {
            sessionStartTimeRef.current = new Date();
        }

        if (chatStatus === 'offline') {
            sessionStartTimeRef.current = null;
            setMessages([]); // Limpa as mensagens ao ficar offline
            return;
        }

        if (!user) return;
        
        let lastMessageTimestamp = null;

        // A query agora filtra mensagens a partir do início da sessão
        const q = query(
            collection(db, "chatMessages"), 
            where("timestamp", ">=", sessionStartTimeRef.current),
            orderBy("timestamp", "asc")
        );
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
        return () => { unsubscribeMsg(); unsubscribeStatus(); };
    }, [chatStatus, isMinimized, popupsEnabled, user, isMuted]);

    // Efeito para rolar para a última mensagem
    useEffect(() => { if (!isMinimized) { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); } }, [messages, isMinimized]);

    const handleSendMessage = async (e) => { 
        e.preventDefault(); 
        if (newMessage.trim() === '') return; 
        setIsLoading(true); 
        const textToSend = newMessage; 
        setNewMessage(''); 
        
        try {
            if (isAiSelected) {
                await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${textToSend}"`;
                const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Erro na API do Gemini');
                }
                await addDoc(collection(db, "chatMessages"), { text: data.text || "Não consegui processar a resposta.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            } else {
                await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
            }
        } catch (error) {
            console.error("Erro ao interagir com a IA ou enviar mensagem:", error);
            await addDoc(collection(db, "chatMessages"), { text: `Ocorreu um erro: ${error.message}. Tente novamente.`, uid: 'ai-assistant', name: 'Sistema', role: 'ai', timestamp: serverTimestamp() });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getRoleColor = (role) => { switch (role) { case 'admin': return 'text-amber-400'; case 'ai': return 'text-cyan-400'; default: return 'text-slate-500 dark:text-slate-400'; } };
    
    const handleCloseChat = () => {
        updateUserChatStatus('offline');
        onClose();
    };

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <MinimizedChat
                newNotification={newNotification}
                onMaximize={() => setIsMinimized(false)}
                getRoleColor={getRoleColor}
            />
        );
    }
    
    return (
        <div className={`fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 ${chatSize === 'normal' ? 'md:h-[600px]' : 'md:h-[90vh]'} flex flex-col bg-white dark:bg-indigo-900 md:rounded-lg shadow-2xl z-20 animate-fade-in`}>
            <ChatHeader
                onlineUsers={onlineUsers}
                getRoleColor={getRoleColor}
                onMinimize={() => setIsMinimized(true)}
                onMaximize={() => setChatSize('maximized')}
                onRestore={() => setChatSize('normal')}
                onCloseChat={handleCloseChat}
                chatSize={chatSize}
            />
            <ChatBody messages={messages} currentUser={user} getRoleColor={getRoleColor} />
            <ChatInput
                newMessage={newMessage}
                onNewMessageChange={(e) => setNewMessage(e.target.value)}
                onSendMessage={handleSendMessage}
                isAiSelected={isAiSelected}
                onAiToggle={() => setIsAiSelected(!isAiSelected)}
                isLoading={isLoading}
                popupsEnabled={popupsEnabled}
                onPopupsToggle={() => setPopupsEnabled(!popupsEnabled)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
            />
        </div>
    );
};

export default GlobalChat;
