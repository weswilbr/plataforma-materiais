// NOME DO ARQUIVO: components/GlobalChat.js
// Versão com importação do Firestore corrigida para resolver o erro de 'updateDoc'.

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import * as firestore from 'firebase/firestore';
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
        if (chatStatus === 'offline' || !user) {
            setMessages([]); // Limpa as mensagens se o chat estiver offline ou não houver usuário
            return;
        }

        const q = firestore.query(firestore.collection(db, "chatMessages"), firestore.orderBy("timestamp", "asc"));
        const unsubscribeMsg = firestore.onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const lastMessage = msgs[msgs.length - 1];
            if (lastMessage && lastMessage.uid !== user.uid) {
                if (!isMuted && notificationSound.current && window.Tone && lastMessage.timestamp) {
                     const messageTime = lastMessage.timestamp.toDate().getTime();
                     const now = new Date().getTime();
                     // Só toca o som para mensagens recentes (últimos 10 segundos)
                     if ((now - messageTime) < 10000) {
                        notificationSound.current.triggerAttackRelease("G5", "8n", window.Tone.now());
                     }
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
            const statuses = snapshot.val() || {};
            const online = Object.keys(statuses)
                .filter(uid => statuses[uid].state === 'online' || statuses[uid].state === 'busy')
                .map(uid => ({ uid, ...statuses[uid] }));
            setOnlineUsers(online);
        });

        return () => { unsubscribeMsg(); unsubscribeStatus(); };
    }, [chatStatus, user, isMinimized, popupsEnabled, isMuted]);

    const handleSendMessage = async (e) => { 
        e.preventDefault(); 
        if (newMessage.trim() === '' || !user) return; 
        setIsLoading(true); 
        const textToSend = newMessage; 
        setNewMessage(''); 
        
        try {
            await firestore.addDoc(firestore.collection(db, "chatMessages"), { 
                text: textToSend, 
                uid: user.uid, 
                name: user.name, 
                role: user.role, 
                timestamp: firestore.serverTimestamp(),
                isDeleted: false,
                editedAt: null,
            });

            if (isAiSelected) {
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${textToSend}"`;
                const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Erro na API do Gemini');
                }
                await firestore.addDoc(firestore.collection(db, "chatMessages"), { text: data.text || "Não consegui processar a resposta.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: firestore.serverTimestamp() });
            }
        } catch (error) {
            console.error("Erro ao interagir com a IA ou enviar mensagem:", error);
            await firestore.addDoc(firestore.collection(db, "chatMessages"), { text: `Ocorreu um erro: ${error.message}. Tente novamente.`, uid: 'ai-assistant', name: 'Sistema', role: 'ai', timestamp: firestore.serverTimestamp() });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateMessage = async (messageId, newText) => {
        const messageRef = firestore.doc(db, "chatMessages", messageId);
        await firestore.updateDoc(messageRef, {
            text: newText,
            editedAt: firestore.serverTimestamp()
        });
    };

    const handleDeleteMessage = async (messageId) => {
        const messageRef = firestore.doc(db, "chatMessages", messageId);
        await firestore.updateDoc(messageRef, {
            text: "Esta mensagem foi apagada.",
            isDeleted: true
        });
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
            <ChatBody 
                messages={messages} 
                onUpdateMessage={handleUpdateMessage}
                onDeleteMessage={handleDeleteMessage}
            />
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

