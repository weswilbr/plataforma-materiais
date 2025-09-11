// NOME DO ARQUIVO: components/GlobalChat.js
// APRIMORAMENTO: Integração das novas funcionalidades do hook `useChatManager`,
// incluindo o contador de mensagens não lidas, o indicador de "digitando..."
// e a lógica para zerar o contador ao maximizar o chat.

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
    
    // Hook centralizado para toda a lógica do chat
    const { 
        messages, 
        onlineUsers, 
        isLoading, 
        newNotification,
        unreadCount,      // <<< NOVO: Recebe o contador de não lidas
        typingUsers,      // <<< NOVO: Recebe a lista de quem está digitando
        sendMessage, 
        updateMessage, 
        deleteMessage,
        updateTypingStatus, // <<< NOVO: Recebe a função para atualizar o status
        resetUnreadCount  // <<< NOVO: Recebe a função para zerar o contador
    } = useChatManager(
        isMinimized, popupsEnabled, isMuted, notificationSound
    );

    // Efeito para carregar e inicializar o som
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js';
        script.async = true;

        const startAudio = () => {
            if (window.Tone && window.Tone.start) {
                window.Tone.start();
                notificationSound.current = new window.Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }).toDestination();
                document.body.removeEventListener('click', startAudio, true);
                document.body.removeEventListener('touchend', startAudio, true);
            }
        };
        
        script.onload = () => {
            document.body.addEventListener('click', startAudio, true);
            document.body.addEventListener('touchend', startAudio, true);
        };
        
        document.body.appendChild(script);

        return () => { 
            if (script.parentNode) document.body.removeChild(script); 
            document.body.removeEventListener('click', startAudio, true);
            document.body.removeEventListener('touchend', startAudio, true);
        };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        await sendMessage(newMessage, isAiSelected);
        setNewMessage('');
        updateTypingStatus(false); // <<< NOVO: Avisa que parou de digitar
    };

    const handleNewMessageChange = (e) => {
        setNewMessage(e.target.value);
        if (e.target.value) {
            updateTypingStatus(true); // <<< NOVO: Avisa que está digitando
        } else {
            updateTypingStatus(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = { admin: 'text-amber-400', ai: 'text-cyan-400' };
        return colors[role] || 'text-slate-500 dark:text-slate-400';
    };

    const handleCloseChat = () => {
        updateUserChatStatus('offline');
        onClose();
    };

    const handleMaximize = () => {
        setIsMinimized(false);
        resetUnreadCount(); // <<< NOVO: Zera o contador ao abrir o chat
    };

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <MinimizedChat 
                newNotification={newNotification} 
                onMaximize={handleMaximize} 
                getRoleColor={getRoleColor}
                unreadCount={unreadCount} // <<< NOVO: Passa o contador para o componente
            />
        );
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
                typingUsers={typingUsers} // <<< NOVO: Passa a lista para o corpo do chat
            />
            <ChatInput
                newMessage={newMessage}
                onNewMessageChange={handleNewMessageChange} // <<< ALTERADO: Usa o novo handler
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