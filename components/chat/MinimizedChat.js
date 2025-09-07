// NOME DO ARQUIVO: components/chat/MinimizedChat.js
// Este componente gere a visualização do chat quando minimizado e as notificações.

import { ChatBubbleIcon } from './ChatIcons';

const MinimizedChat = ({ newNotification, onMaximize, getRoleColor }) => {

    const NotificationPopup = ({ notification }) => {
        if (!notification) return null;

        // Escolhe o ícone com base no papel (role) do remetente
        const icon = notification.role === 'ai' ? '🤖' : '👤';
        
        return (
            <div className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-700 p-3 rounded-lg shadow-xl animate-fade-in border dark:border-slate-600">
                <p className={`font-bold text-sm ${getRoleColor(notification.role)} flex items-center gap-2`}>
                    <span>{icon}</span>
                    <span>{notification.name}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">
                    {notification.text}
                </p>
            </div>
        );
    };

    return (
        <div className="fixed bottom-4 right-4 z-20">
            <NotificationPopup notification={newNotification} />
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

