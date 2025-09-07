// NOME DO ARQUIVO: components/chat/ChatUI.js
// Versão com ícones de traço mais fino e um seletor de emojis redesenhado.

import React from 'react';

// --- Ícones de Ação ---
export const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
export const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
export const EmojiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>;
export const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>;
export const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;

// --- Ícones de Controlo da Janela ---
export const MinimizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
export const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Ícones de Definições ---
export const SoundOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>;
export const SoundOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" x2="17" y1="9" y2="15"></line><line x1="17" x2="23" y1="9" y2="15"></line></svg>;

// --- Seletor de Emojis Aprimorado ---
export const EmojiPicker = ({ onEmojiSelect }) => {
    const emojisByCategory = {
        'Rostos e Emoções': ['😀', '😂', '😍', '🤔', '😊', '😭', '😡', '😴', '😮', '🤯', '🥳', '😎'],
        'Pessoas e Gestos': ['👍', '🙏', '👏', '🙌', '👋', '💪', '👌', '✌️', '🤞', '🤟', '🤙', '👀'],
        'Símbolos e Objetos': ['🔥', '🚀', '🎉', '❤️', '💡', '✨', '💰', '🏆', '✅', '❌', '💯', '🔔'],
    };

    return (
        <div className="absolute bottom-24 left-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 p-1 rounded-2xl shadow-2xl border dark:border-slate-600 w-72 z-20">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-t-xl">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Reações Rápidas</h3>
            </div>
            <div className="p-3">
                {Object.entries(emojisByCategory).map(([category, emojis]) => (
                    <div key={category} className="mb-2">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 px-1">{category}</h4>
                        <div className="grid grid-cols-6 gap-1">
                            {emojis.map(emoji => (
                                <button 
                                    key={emoji} 
                                    onClick={() => onEmojiSelect(emoji)}
                                    className="text-2xl p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors transform hover:scale-110"
                                    aria-label={`Selecionar emoji ${emoji}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

