// NOME DO ARQUIVO: components/GlobalChat.js
// Versão com a nova tela de "Entrar no Chat" e controlo de status (online, ocupado, offline).

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect } from "firebase/database";

// --- Ícones SVG ---
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

// Sub-componente para a lista de utilizadores online
const OnlineUsersModal = ({ users, onClose, getRoleColor, getStatusIndicator }) => (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex justify-end" onClick={onClose}>
        <div className="w-80 h-full bg-white dark:bg-slate-800 shadow-2xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Na Comunidade ({users.length})</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
                {users.map(onlineUser => (
                    <div key={onlineUser.uid} className="flex items-center gap-3">
                        {getStatusIndicator(onlineUser.state)}
                        <p className={`font-medium ${getRoleColor(onlineUser.role)}`}>{onlineUser.name}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const GlobalChat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOnlineListVisible, setIsOnlineListVisible] = useState(false);
    const [userStatus, setUserStatus] = useState('offline');
    const messagesEndRef = useRef(null);

    // Efeitos de busca de dados
    useEffect(() => {
        if (!userStatus || userStatus === 'offline') return;

        const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
        const unsubscribeMsg = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => { msgs.push({ id: doc.id, ...doc.data() }); });
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
    }, [userStatus]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    
    const updateUserStatus = (state) => {
        if (!user) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);
        if (state === 'offline') {
            set(userStatusRef, { state: 'offline', last_changed: serverTimestamp() });
            setUserStatus('offline');
        } else {
             onValue(ref(rtdb, '.info/connected'), (snapshot) => {
                if (snapshot.val() === false) return;
                onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() }).then(() => {
                    set(userStatusRef, { state, name: user.name, role: user.role, last_changed: serverTimestamp() });
                    setUserStatus(state);
                });
            }, { onlyOnce: true });
        }
    };

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

    if (userStatus === 'offline') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-indigo-900 rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Comunidade da Equipe</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-md">Conecte-se com outros membros da equipe, troque ideias e tire dúvidas em tempo real.</p>
                <button onClick={() => updateUserStatus('online')} className="mt-8 px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Entrar no Chat e Ficar Online
                </button>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col bg-white dark:bg-indigo-900 rounded-lg shadow-lg relative overflow-hidden">
            {isOnlineListVisible && <OnlineUsersModal users={onlineUsers} onClose={() => setIsOnlineListVisible(false)} getRoleColor={getRoleColor} getStatusIndicator={getStatusIndicator} />}
            <header className="p-4 border-b border-slate-200 dark:border-indigo-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chat Global da Equipe</h2>
                <div className="flex items-center gap-4">
                    <button onClick={() => updateUserStatus(userStatus === 'online' ? 'busy' : 'online')} className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${userStatus === 'busy' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                        {userStatus === 'busy' ? 'Ficar Disponível' : 'Ficar Ocupado'}
                    </button>
                    <button onClick={() => updateUserStatus('offline')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:underline">Sair do Chat</button>
                    <button onClick={() => setIsOnlineListVisible(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-indigo-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-indigo-700 transition">
                        <UsersIcon /><span>Online ({onlineUsers.length})</span>
                    </button>
                </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-lg ${msg.uid === user.uid ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-indigo-800 rounded-bl-none'}`}>
                            <p className={`font-bold text-sm mb-1 ${getRoleColor(msg.role)} ${msg.uid === user.uid ? 'hidden' : 'block'}`}>{msg.name}</p>
                            <p className="text-base">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-slate-200 dark:border-indigo-800">
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

