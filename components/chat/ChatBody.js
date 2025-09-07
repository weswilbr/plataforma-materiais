// NOME DO ARQUIVO: components/chat/ChatBody.js
// Este componente é responsável por renderizar a lista de mensagens no chat.

import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChatMessage from './ChatMessage';

const ChatBody = ({ messages }) => {
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    // Efeito para rolar automaticamente para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-amber-400';
            case 'ai': return 'text-cyan-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    return (
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.uid === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-xs md:max-w-sm ${msg.uid === user?.uid ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-indigo-800 rounded-bl-none'}`}>
                        <p className={`font-bold text-sm mb-1 ${getRoleColor(msg.role)} ${msg.uid === user?.uid ? 'hidden' : 'block'}`}>
                            {msg.name}
                        </p>
                        <ChatMessage text={msg.text} />
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </main>
    );
};

export default ChatBody;

