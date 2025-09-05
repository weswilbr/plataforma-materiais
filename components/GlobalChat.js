// NOME DO ARQUIVO: components/GlobalChat.js
// Versão corrigida para ler os dados do utilizador diretamente do status de presença.

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, rtdb } from '../firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, onValue } from "firebase/database";

const GlobalChat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Efeito para buscar as mensagens em tempo real
    useEffect(() => {
        const q = query(collection(db, "chatMessages"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

    // Efeito para buscar utilizadores online em tempo real (LÓGICA CORRIGIDA)
    useEffect(() => {
        const statusRef = ref(rtdb, '/status');
        const unsubscribe = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val();
            const online = [];
            if (statuses) {
                for (const uid in statuses) {
                    // Lê o nome e a role diretamente do status, sem precisar de uma nova busca.
                    if (statuses[uid].state === 'online') {
                        online.push({
                            uid,
                            name: statuses[uid].name,
                            role: statuses[uid].role,
                        });
                    }
                }
            }
            setOnlineUsers(online);
        });
        return () => unsubscribe();
    }, []);

    // Efeito para rolar para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        setIsLoading(true);

        const textToSend = newMessage;
        setNewMessage('');

        if (isAiSelected) {
            try {
                // Adiciona a pergunta do utilizador ao chat imediatamente
                await addDoc(collection(db, "chatMessages"), {
                    text: textToSend,
                    uid: user.uid,
                    name: user.name,
                    role: user.role,
                    timestamp: serverTimestamp()
                });

                // Prepara e envia o prompt para a IA
                const prompt = `Você é um assistente virtual da Equipe de Triunfo, especialista em 4Life e Marketing de Rede. Responda à seguinte pergunta de forma útil e objetiva, mantendo-se estritamente dentro desses tópicos. Pergunta do usuário: "${textToSend}"`;
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                });
                const data = await response.json();
                
                // Adiciona a resposta da IA ao chat
                await addDoc(collection(db, "chatMessages"), {
                    text: data.text || "Não consegui processar a resposta.",
                    uid: 'ai-assistant',
                    name: 'Assistente IA',
                    role: 'ai',
                    timestamp: serverTimestamp()
                });

            } catch (error) {
                console.error("Erro ao interagir com a IA:", error);
                 await addDoc(collection(db, "chatMessages"), {
                    text: "Ocorreu um erro ao conectar com o assistente. Tente novamente.",
                    uid: 'ai-assistant',
                    name: 'Assistente IA',
                    role: 'ai',
                    timestamp: serverTimestamp()
                });
            }
        } else {
            // Envia mensagem normal de utilizador
            await addDoc(collection(db, "chatMessages"), {
                text: textToSend,
                uid: user.uid,
                name: user.name,
                role: user.role,
                timestamp: serverTimestamp()
            });
        }
        setIsLoading(false);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-amber-400';
            case 'ai': return 'text-cyan-400';
            default: return 'text-slate-300';
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-white dark:bg-indigo-900 rounded-lg shadow-lg overflow-hidden">
            {/* Coluna Principal do Chat */}
            <div className="h-full flex flex-1 flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-indigo-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chat Global da Equipe</h2>
                </header>
                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-lg ${msg.uid === user.uid ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-indigo-800'}`}>
                                <p className={`font-bold text-sm mb-1 ${getRoleColor(msg.role)}`}>{msg.name}</p>
                                <p className="text-base">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t border-slate-200 dark:border-indigo-800">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."}
                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            disabled={isLoading}
                        />
                        <button type="submit" className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar'}
                        </button>
                        <div className="flex items-center" title="Ativar/Desativar Assistente IA">
                             <input 
                                type="checkbox"
                                id="ai-toggle"
                                checked={isAiSelected}
                                onChange={() => setIsAiSelected(!isAiSelected)}
                                className="w-5 h-5 text-cyan-400 bg-slate-200 border-slate-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                            />
                             <label htmlFor="ai-toggle" className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Falar com IA</label>
                        </div>
                    </form>
                </footer>
            </div>

            {/* Coluna de Utilizadores Online */}
            <aside className="w-full md:w-64 border-l border-slate-200 dark:border-indigo-800 flex flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-indigo-800">
                    <h3 className="font-bold text-slate-800 dark:text-white">Online ({onlineUsers.length})</h3>
                </header>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {onlineUsers.map(onlineUser => (
                        <div key={onlineUser.uid} className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <p className={`font-medium ${getRoleColor(onlineUser.role)}`}>{onlineUser.name}</p>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
};

export default GlobalChat;

