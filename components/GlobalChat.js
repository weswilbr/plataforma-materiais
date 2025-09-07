// NOME DO ARQUIVO: components/GlobalChat.js
// Componente principal do chat, refatorado para usar hooks e componentes separados.

import React, { useState } from 'react';
import useChatManager from './hooks/useChatManager';
import ChatHeader from './chat/ChatHeader';
import ChatBody from './chat/ChatBody';
import ChatFooter from './chat/ChatFooter';
import MinimizedChat from './chat/MinimizedChat';
import { useAuth } from '../contexts/AuthContext';

const GlobalChat = ({ isVisible, onClose }) => {
    const { user, updateUserChatStatus } = useAuth();
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false);

    const {
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        isAiSelected,
        setIsAiSelected,
        isLoading,
        isMinimized,
        setIsMinimized,
        newNotification,
        popupsEnabled,
        setPopupsEnabled,
        isMuted,
        setIsMuted,
        handleSendMessage,
    } = useChatManager();

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-amber-400';
            case 'ai': return 'text-cyan-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    const handleCloseChat = () => {
        updateUserChatStatus('offline');
        onClose();
    };

    if (!isVisible) return null;

    if (isMinimized) {
        return (
            <MinimizedChat
                newNotification={newNotification}
                onMaximize={() => setIsMinimized(false)}
                getRoleColor={getRoleColor}
            />
        );
    }
    
    return (
        <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] flex flex-col bg-white dark:bg-indigo-900 md:rounded-lg shadow-2xl z-20 animate-fade-in">
            <ChatHeader
                onlineUsersCount={onlineUsers.length}
                isOptionsMenuVisible={isOptionsMenuVisible}
                toggleOptionsMenu={() => setIsOptionsMenuVisible(!isOptionsMenuVisible)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onMinimize={() => setIsMinimized(true)}
                onCloseChat={handleCloseChat}
                onlineUsers={onlineUsers}
                getRoleColor={getRoleColor}
            />
            <ChatBody messages={messages} currentUser={user} getRoleColor={getRoleColor} />
            <ChatFooter
                newMessage={newMessage}
                onNewMessageChange={(e) => setNewMessage(e.target.value)}
                onSendMessage={handleSendMessage}
                isAiSelected={isAiSelected}
                onAiToggle={() => setIsAiSelected(!isAiSelected)}
                isLoading={isLoading}
                popupsEnabled={popupsEnabled}
                onPopupsToggle={() => setPopupsEnabled(!popupsEnabled)}
            />
        </div>
    );
};

export default GlobalChat;

