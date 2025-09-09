// NOME DO ARQUIVO: components/GlobalChat.js
// REFACTOR: Componente principal do chat foi simplificado. Toda a lógica de estado
// foi movida para o hook `useChatManager`, tornando este componente responsável apenas pela UI.

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useChatManager from '../hooks/useChatManager';
import ChatHeader from './chat/ChatHeader';
import ChatBody from './chat/ChatBody';
import ChatInput from './chat/ChatInput';
import MinimizedChat from './chat/MinimizedChat';

const GlobalChat = ({ isVisible, onClose }) => {
    const { updateUserChatStatus } = useAuth();
    
    // Estados da UI local
    const [newMessage, setNewMessage] = useState('');
    const [isAiSelected, setIsAiSelected] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [chatSize, setChatSize] = useState('normal');
    const [popupsEnabled, setPopupsEnabled] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const notificationSound = useRef(null);
    
    // Hook centralizado para a lógica do chat
    const { messages, onlineUsers, isLoading, newNotification, sendMessage, updateMessage, deleteMessage } = useChatManager(
        isMinimized, popupsEnabled, isMuted, notificationSound
    );

    // Efeito para carregar e inicializar o som
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js';
        script.async = true;
        script.onload = () => {
            const startAudio = () => {
                if (window.Tone && window.Tone.start) {
                    window.Tone.start();
                    notificationSound.current = new window.Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }).toDestination();
                    document.body.removeEventListener('click', startAudio);
                }
            };
            document.body.addEventListener('click', startAudio);
        };
        document.body.appendChild(script);
        return () => { if (script.parentNode) document.body.removeChild(script); };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        await sendMessage(newMessage, isAiSelected);
        setNewMessage('');
    };

    const getRoleColor = (role) => {
        const colors = { admin: 'text-amber-400', ai: 'text-cyan-400' };
        return colors[role] || 'text-slate-500 dark:text-slate-400';
    };

    const handleCloseChat = () => {
        updateUserChatStatus('offline');
        onClose();
    };

    if (!isVisible) return null;

    if (isMinimized) {
        return <MinimizedChat newNotification={newNotification} onMaximize={() => setIsMinimized(false)} getRoleColor={getRoleColor} />;
    }

    return (
        <div className={`fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 ${chatSize === 'normal' ? 'md:h-[600px]' : 'md:h-[90vh]'} flex flex-col bg-white dark:bg-indigo-900 md:rounded-lg shadow-2xl z-20 animate-fade-in`}>
            <ChatHeader
                onlineUsers={onlineUsers}
                getRoleColor={getRoleColor}
                onMinimize={() => setIsMinimized(true)}
                onMaximize={() => setChatSize('maximized')}
                onRestore={() => setChatSize('normal')}
                onCloseChat={handleCloseChat}
                chatSize={chatSize}
            />
            <ChatBody 
                messages={messages} 
                onUpdateMessage={updateMessage}
                onDeleteMessage={deleteMessage}
            />
            <ChatInput
                newMessage={newMessage}
                onNewMessageChange={(e) => setNewMessage(e.target.value)}
                onSendMessage={handleSendMessage}
                isAiSelected={isAiSelected}
                onAiToggle={() => setIsAiSelected(!isAiSelected)}
                isLoading={isLoading}
                popupsEnabled={popupsEnabled}
                onPopupsToggle={() => setPopupsEnabled(!popupsEnabled)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
            />
        </div>
    );
};

export default GlobalChat;

