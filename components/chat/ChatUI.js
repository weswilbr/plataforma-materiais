// NOME DO ARQUIVO: components/chat/ChatUI.js
// Contém os sub-componentes visuais e ícones, agora com controlo de som.

import React from 'react';

// --- Ícones SVG ---
export const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>;
export const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
export const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
export const MinimizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>;
export const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>;
export const EmojiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>;
export const SoundOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>;
export const SoundOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" x2="17" y1="9" y2="15"></line><line x1="17" x2="23" y1="9" y2="15"></line></svg>;


// --- Sub-componente para o seletor de emojis ---
export const EmojiPicker = ({ onEmojiSelect }) => {
    const emojis = ['😀', '😂', '😍', '🤔', '👍', '🙏', '🔥', '🚀', '🎉', '❤️', '👏', '💡'];
    return (
        <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-xl border dark:border-slate-600">
            <div className="grid grid-cols-6 gap-2">
                {emojis.map(emoji => (
                    <button 
                        key={emoji} 
                        onClick={() => onEmojiSelect(emoji)}
                        className="text-2xl p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Sub-componente para a lista de utilizadores online ---
export const OnlineUsersModal = ({ users, onClose, getRoleColor, getStatusIndicator }) => (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex justify-end" onClick={onClose}>
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

