// NOME DO ARQUIVO: components/chat/ChatBody.js
// REFACTOR: Atualizado para usar o novo componente MessageRenderer e simplificar a lógica.

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

const ChatBody = ({ messages, onUpdateMessage, onDeleteMessage }) => {
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => {
                const isMyMessage = msg.uid === user?.uid;

                if (editingMessage?.id === msg.id) {
                    return (
                        <div key={msg.id} className="flex justify-end">
                            <form onSubmit={handleSaveEdit} className="w-full max-w-sm p-2 bg-slate-200 dark:bg-indigo-950 rounded-lg">
                                <textarea
                                    value={editingMessage.text}
                                    onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                                    className="form-textarea w-full p-2 bg-slate-50 dark:bg-indigo-800 rounded-md"
                                    rows="3" autoFocus disabled={isSaving}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setEditingMessage(null)} className="px-3 py-1 text-sm rounded-md bg-slate-300 dark:bg-slate-700" disabled={isSaving}>Cancelar</button>
                                    <button type="submit" className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white" disabled={isSaving}>{isSaving ? 'A salvar...' : 'Salvar'}</button>
                                </div>
                            </form>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex items-end gap-2 group ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                        {isMyMessage && !msg.isDeleted && (
                            <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === msg.id ? null : msg.id); }} className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <MoreOptionsIcon />
                                </button>
                                {activeMenu === msg.id && <MessageMenu onEdit={() => setEditingMessage(msg)} onDelete={() => onDeleteMessage(msg.id)} />}
                            </div>
                        )}
                        <div className={`p-3 rounded-2xl max-w-xs md:max-w-sm ${isMyMessage ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-indigo-800 rounded-bl-none'}`}>
                            {!isMyMessage && msg.role !== 'ai' && <p className={`font-bold text-sm mb-1 ${getRoleColor(msg.role)}`}>{msg.name}</p>}
                            {msg.isDeleted ? <p className="italic text-sm text-slate-400 dark:text-slate-500">{msg.text}</p> : <MessageRenderer text={msg.text} />}
                            <div className="text-right text-xs mt-1.5 opacity-70">
                                {msg.editedAt && <span>(editado) </span>}
                                {formatTimestamp(msg.timestamp)}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </main>
    );
};

export default ChatBody;
