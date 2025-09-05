// NOME DO ARQUIVO: components/GlobalChat.js
// Versão redesenhada como um widget flutuante e independente.

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        setIsLoading(true);
        const textToSend = newMessage;
        setNewMessage('');

        if (isAiSelected) {
            try {
                await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${textToSend}"`;
                const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), });
                const data = await response.json();
                await addDoc(collection(db, "chatMessages"), { text: data.text || "Não consegui processar a resposta.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            } catch (error) {
                console.error("Erro ao interagir com a IA:", error);
                 await addDoc(collection(db, "chatMessages"), { text: "Ocorreu um erro ao conectar com o assistente. Tente novamente.", uid: 'ai-assistant', name: 'Assistente IA', role: 'ai', timestamp: serverTimestamp() });
            }
        } else {
            await addDoc(collection(db, "chatMessages"), { text: textToSend, uid: user.uid, name: user.name, role: user.role, timestamp: serverTimestamp() });
        }
        setIsLoading(false);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-amber-400';
            case 'ai': return 'text-cyan-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };
    
    const getStatusIndicator = (state) => {
        const color = state === 'online' ? 'bg-green-500' : 'bg-yellow-500';
        return (
            <span className="relative flex h-3 w-3">
                {state === 'online' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
            </span>
        );
    };

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
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chat Global</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => updateUserChatStatus(chatStatus === 'online' ? 'busy' : 'online')} className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${chatStatus === 'busy' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>{chatStatus === 'busy' ? 'Ocupado' : 'Disponível'}</button>
                    <button onClick={() => { updateUserChatStatus('offline'); onClose(); }} className="text-sm font-medium text-red-500 hover:underline">Sair</button>
                    <button onClick={() => setIsOnlineListVisible(true)} className="p-1.5 bg-slate-100 dark:bg-indigo-800 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-indigo-700 transition"><UsersIcon /></button>
                    <button onClick={() => setIsMinimized(true)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" title="Minimizar"><MinimizeIcon /></button>
                </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-lg ${msg.uid === user.uid ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-indigo-800 rounded-bl-none'}`}>
                            <p className={`font-bold text-sm mb-1 ${getRoleColor(msg.role)} ${msg.uid === user.uid ? 'hidden' : 'block'}`}>{msg.name}</p>
                            <p className="text-base break-words">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-slate-200 dark:border-indigo-800">
                 <div className="flex items-center justify-center mb-2">
                    <label htmlFor="popups-toggle" className="flex items-center cursor-pointer text-xs text-slate-500 dark:text-slate-400">
                        <input type="checkbox" id="popups-toggle" checked={popupsEnabled} onChange={() => setPopupsEnabled(!popupsEnabled)} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"/>
                        <span className="ml-2">Notificações pop-up</span>
                    </label>
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button type="button" onClick={() => setIsAiSelected(!isAiSelected)} className={`p-2 rounded-full transition ${isAiSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-indigo-800 text-slate-500 dark:text-slate-300'}`} title="Falar com a IA"><AiIcon /></button>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."} className="flex-1 px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-full focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" disabled={isLoading} />
                    <button type="submit" className="p-2.5 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:bg-slate-400" disabled={isLoading}><SendIcon /></button>
                </form>
            </footer>
        </div>
    );
};

export default GlobalChat;

