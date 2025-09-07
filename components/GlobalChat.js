// NOME DO ARQUIVO: components/GlobalChat.js
// Versão final refatorada que utiliza hooks e componentes separados.

import { useState } from 'react';
import useChatManager from './hooks/useChatManager';
import ChatHeader from './chat/ChatHeader';
import ChatBody from './chat/ChatBody';
import ChatFooter from './chat/ChatFooter';
import MinimizedChat from './chat/MinimizedChat';

const GlobalChat = ({ isVisible, onClose }) => {
    // Utiliza o hook para gerir toda a lógica e estado do chat
    const {
        user,
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        isAiSelected,
        setIsAiSelected,
        isLoading,
        isMuted,
        setIsMuted,
        popupsEnabled,
        setPopupsEnabled,
        newNotification,
        handleSendMessage,
    } = useChatManager();

    const [isMinimized, setIsMinimized] = useState(false);
    const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    // Funções para controlar a visibilidade do menu e do seletor de emojis
    const toggleOptionsMenu = () => setIsOptionsMenuVisible(!isOptionsMenuVisible);
    const toggleEmojiPicker = () => setIsEmojiPickerVisible(!isEmojiPickerVisible);
    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setIsEmojiPickerVisible(false);
    };

    // Função para obter a cor do papel (role) do utilizador para a estilização
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-amber-400';
            case 'ai': return 'text-cyan-400';
            default: return 'text-slate-500 dark:text-slate-400';
        }
    };

    // Se o chat não estiver visível, não renderiza nada
    if (!isVisible) {
        return null;
    }

    // Se estiver minimizado, renderiza o componente minimizado
    if (isMinimized) {
        return (
            <MinimizedChat
                newNotification={newNotification}
                onMaximize={() => setIsMinimized(false)}
                getRoleColor={getRoleColor}
            />
        );
    }

    // Renderiza o chat completo
    return (
        <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] flex flex-col bg-white dark:bg-indigo-900 md:rounded-lg shadow-2xl z-20 animate-fade-in">
            <ChatHeader
                onlineUsersCount={onlineUsers.length}
                isOptionsMenuVisible={isOptionsMenuVisible}
                toggleOptionsMenu={toggleOptionsMenu}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onMinimize={() => setIsMinimized(true)}
                onCloseChat={onClose}
                onlineUsers={onlineUsers}
                getRoleColor={getRoleColor}
            />

            <ChatBody
                messages={messages}
                currentUser={user}
                getRoleColor={getRoleColor}
            />

            <ChatFooter
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                isAiSelected={isAiSelected}
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
                isEmojiPickerVisible={isEmojiPickerVisible}
                toggleEmojiPicker={toggleEmojiPicker}
                handleEmojiSelect={handleEmojiSelect}
                toggleAiMode={() => setIsAiSelected(!isAiSelected)}
                popupsEnabled={popupsEnabled}
                onPopupsToggle={() => setPopupsEnabled(!popupsEnabled)}
            />
        </div>
    );
};

export default GlobalChat;

