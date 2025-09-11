// NOME DO ARQUIVO: components/chat/ChatBody.js
// APRIMORAMENTO: Adicionada lógica para agrupar visualmente mensagens
// consecutivas do mesmo usuário, avatares e indicador de "digitando...".

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MessageRenderer from './MessageRenderer';
import { MoreOptionsIcon, EditIcon, DeleteIcon } from './ChatUI';

const MessageMenu = ({ onEdit, onDelete }) => (
    <div className="absolute top-0 right-full mr-2 bg-white dark:bg-slate-700 shadow-lg rounded-md p-1 z-10">
        <button onClick={onEdit} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-600">
            <EditIcon /> Editar
        </button>
        <button onClick={onDelete} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">
            <DeleteIcon /> Apagar
        </button>
    </div>
);

const TypingIndicator = ({ users }) => {
    if (users.length === 0) return null;
    const names = users.map(u => u.name).join(', ');
    return (
        <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-indigo-700 flex items-center justify-center font-bold text-sm text-white animate-pulse">
                ...
            </div>
            <div className="p-3 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-indigo-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {names} {users.length > 1 ? 'estão a digitar...' : 'está a digitar...'}
                </p>
            </div>
        </div>
    );
};

const ChatBody = ({ messages, onUpdateMessage, onDeleteMessage, typingUsers }) => {
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp?.toDate) return '';
        return timestamp.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (isSaving || !editingMessage?.text.trim()) return;
        setIsSaving(true);
        await onUpdateMessage(editingMessage.id, editingMessage.text);
        setEditingMessage(null);
        setIsSaving(false);
    };

    const getRoleColor = (role) => ({ admin: 'text-amber-400', ai: 'text-cyan-400' })[role] || 'text-slate-500 dark:text-slate-400';

    return (
        <main className="flex-1 p-4 overflow-y-auto space-y-1">
            {messages.map((msg, index) => {
                const isMyMessage = msg.uid === user?.uid;

                const prevMessage = messages[index - 1];
                const nextMessage = messages[index + 1];
                const isFirstInGroup = !prevMessage || prevMessage.uid !== msg.uid || (new Date(msg.timestamp?.toDate()) - new Date(prevMessage.timestamp?.toDate())) > 60000 * 5; // Nova mensagem se > 5 min
                const isLastInGroup = !nextMessage || nextMessage.uid !== msg.uid || (new Date(nextMessage.timestamp?.toDate()) - new Date(msg.timestamp?.toDate())) > 60000 * 5;
                
                let bubbleClasses = '';
                if(isMyMessage) {
                    bubbleClasses = isFirstInGroup && !isLastInGroup ? 'rounded-br-lg' : isLastInGroup && !isFirstInGroup ? 'rounded-tr-lg' : !isFirstInGroup && !isLastInGroup ? 'rounded-tr-lg rounded-br-lg' : 'rounded-br-none';
                } else {
                    bubbleClasses = isFirstInGroup && !isLastInGroup ? 'rounded-bl-lg' : isLastInGroup && !isFirstInGroup ? 'rounded-tl-lg' : !isFirstInGroup && !isLastInGroup ? 'rounded-tl-lg rounded-bl-lg' : 'rounded-bl-none';
                }

                if (editingMessage?.id === msg.id) { /* ... modo de edição ... */ }

                return (
                    <div key={msg.id} className={`flex items-end gap-2 group ${isMyMessage ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}`}>
                        <div className={`flex-shrink-0 w-8 ${isMyMessage ? 'order-2' : 'order-1'}`}>
                            {!isMyMessage && isLastInGroup && (
                                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-indigo-700 flex items-center justify-center font-bold text-sm text-white">
                                    {msg.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {isMyMessage && !msg.isDeleted && (
                            <div className="relative order-1">
                                <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === msg.id ? null : msg.id); }} className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-indigo-700">
                                    <MoreOptionsIcon />
                                </button>
                                {activeMenu === msg.id && <MessageMenu onEdit={() => setEditingMessage(msg)} onDelete={() => onDeleteMessage(msg.id)} />}
                            </div>
                        )}

                        <div className={`order-2 ${isMyMessage ? 'pl-8' : 'pr-8'}`}>
                            {!isMyMessage && isFirstInGroup && msg.role !== 'ai' && <p className={`font-bold text-sm mb-1 ml-3 ${getRoleColor(msg.role)}`}>{msg.name}</p>}
                            <div className={`p-3 rounded-2xl max-w-xs md:max-w-sm ${bubbleClasses} ${isMyMessage ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'bg-slate-100 dark:bg-indigo-800'}`}>
                                {msg.isDeleted ? <p className="italic text-sm text-slate-400 dark:text-slate-500">{msg.text}</p> : <MessageRenderer text={msg.text} />}
                                <div className="text-right text-xs mt-1.5 opacity-70">
                                    {msg.editedAt && <span>(editado) </span>}
                                    {formatTimestamp(msg.timestamp)}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <TypingIndicator users={typingUsers} />
            <div ref={messagesEndRef} />
        </main>
    );
};

export default ChatBody;