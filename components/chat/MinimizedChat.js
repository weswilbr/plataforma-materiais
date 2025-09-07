// NOME DO ARQUIVO: components/chat/MinimizedChat.js
// Componente refatorado para o chat minimizado, com importações corrigidas.

import React from 'react';
import { ChatBubbleIcon } from './ChatUI'; // Caminho corrigido

const MinimizedChat = ({ newNotification, onMaximize, getRoleColor }) => {
    return (
        <div className="fixed bottom-4 right-4 z-20">
            {newNotification && (
                <div className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-700 p-3 rounded-lg shadow-xl animate-fade-in">
                    <p className="font-bold text-sm flex items-center gap-2">
                        <span>{newNotification.role === 'ai' ? '🤖' : '👤'}</span>
                        <span className={getRoleColor(newNotification.role)}>{newNotification.name}</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
                        {newNotification.text}
                    </p>
                </div>
            )}
            <button 
                onClick={onMaximize} 
                className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" 
                title="Maximizar Chat"
                aria-label="Maximizar Chat"
            >
                <ChatBubbleIcon />
            </button>
        </div>
    );
};

export default MinimizedChat;

