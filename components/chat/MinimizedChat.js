// NOME DO ARQUIVO: components/MinimizedChat.js
// APRIMORAMENTO: Adicionado contador de mensagens não lidas, notificação auto-destrutiva,
// feedback pulsante e pop-up clicável para uma UX moderna e interativa.

import React, { useState, useEffect } from 'react';
import { ChatBubbleIcon } from './ChatUI';

const MinimizedChat = ({ newNotification, onMaximize, getRoleColor, unreadCount }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    // Efeito para controlar a visibilidade da notificação pop-up
    useEffect(() => {
        if (newNotification) {
            setShowPopup(true);
            setIsPulsing(true);

            // O pop-up desaparece após 5 segundos
            const popupTimer = setTimeout(() => {
                setShowPopup(false);
            }, 5000);
            
            // A animação de pulso dura 2 segundos
            const pulseTimer = setTimeout(() => {
                setIsPulsing(false);
            }, 2000);

            // Limpa os timers se o componente for desmontado
            return () => {
                clearTimeout(popupTimer);
                clearTimeout(pulseTimer);
            };
        }
    }, [newNotification]); // Dispara sempre que uma nova notificação chega

    return (
        <div className="fixed bottom-4 right-4 z-20">
            {/* <<< NOVO: Pop-up agora é clicável e auto-destrutivo >>> */}
            {showPopup && newNotification && (
                <button 
                    onClick={onMaximize}
                    className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-700 p-3 rounded-lg shadow-xl animate-fade-in cursor-pointer text-left"
                >
                    {/* <<< NOVO: "Cauda" do balão de notificação >>> */}
                    <div className="absolute bottom-[-8px] right-5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-slate-700"></div>

                    <p className="font-bold text-sm flex items-center gap-2">
                        <span>{newNotification.role === 'ai' ? '🤖' : '👤'}</span>
                        <span className={getRoleColor(newNotification.role)}>{newNotification.name}</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
                        {newNotification.text}
                    </p>
                </button>
            )}

            {/* O botão principal do chat minimizado */}
            <button 
                onClick={onMaximize} 
                className={`relative w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ${isPulsing ? 'animate-pulse' : ''}`}
                title="Maximizar Chat"
                aria-label="Maximizar Chat"
            >
                <ChatBubbleIcon />

                {/* <<< NOVO: Contador de mensagens não lidas >>> */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default MinimizedChat;