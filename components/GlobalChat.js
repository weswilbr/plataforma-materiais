// NOME DO ARQUIVO: components/GlobalChat.js
// Versão com a funcionalidade de minimizar, pop-ups de novas mensagens e controlo de notificações.

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";
import { SendIcon, AiIcon, UsersIcon, MinimizeIcon, ChatBubbleIcon, OnlineUsersModal } from './chat/ChatUI';

const GlobalChat = ({ isVisible, onClose }) => {
    const { user, chatStatus, updateUserChatStatus } = useAuth();
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOnlineListVisible, setIsOnlineListVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [newNotification, setNewNotification] = useState(null);
    const [popupsEnabled, setPopupsEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const notificationSound = useRef(null);

    // Efeito para carregar o Tone.js e inicializar o som
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js';
        script.async = true;
        script.onload = () => {
            const startAudio = () => {
                window.Tone.start();
                notificationSound.current = new window.Tone.Synth().toDestination();
                document.body.removeEventListener('click', startAudio);
            };
            document.body.addEventListener('click', startAudio);
        };
        document.body.appendChild(script);
        return () => {
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (chatStatus === 'offline') {
            setMessages([]);
            return;
        }

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
                if (isMinimized && popupsEnabled) {
                    setNewNotification(lastMessage);
                    if (notificationSound.current) {
                        notificationSound.current.triggerAttackRelease("C5", "8n");
                    }
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
    }, [chatStatus, isMinimized, popupsEnabled, user.uid]);

    useEffect(() => { 
        if(!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
        }
    }, [messages, isMinimized]);

    const handleSendMessage = async (e) => { /* ... (código existente) ... */ };
    const getRoleColor = (role) => { /* ... (código existente) ... */ };
    const getStatusIndicator = (state) => { /* ... (código existente) ... */ };

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-20">
                {newNotification && (
                    <div className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-700 p-3 rounded-lg shadow-xl animate-fade-in">
                        <p className={`font-bold text-sm ${getRoleColor(newNotification.role)}`}>{newNotification.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{newNotification.text}</p>
                    </div>
                )}
                <button 
                    onClick={() => setIsMinimized(false)} 
                    className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    title="Maximizar Chat"
                >
                    <ChatBubbleIcon />
                </button>
            </div>
        );
    }
    
    return (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-white dark:bg-indigo-900 rounded-lg shadow-2xl z-20 animate-fade-in">
            {isOnlineListVisible && <OnlineUsersModal users={onlineUsers} onClose={() => setIsOnlineListVisible(false)} getRoleColor={getRoleColor} getStatusIndicator={getStatusIndicator} />}
            <header className="p-4 border-b border-slate-200 dark:border-indigo-800 flex justify-between items-center">
                {/* ... (código do cabeçalho) ... */}
            </header>
            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* ... (código das mensagens) ... */}
            </main>
            <footer className="p-4 border-t border-slate-200 dark:border-indigo-800">
                 {/* ... (código do rodapé) ... */}
            </footer>
        </div>
    );
};

export default GlobalChat;

