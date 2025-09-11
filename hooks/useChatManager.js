// NOME DO ARQUIVO: hooks/useChatManager.js
// RESPONSABILIDADE: Orquestra os hooks 'useOnlineUsers' e 'useChatMessages'
// e gerencia a lógica de "digitando..." que conecta os dois.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { rtdb } from '../firebase';
import { ref, set, onDisconnect, onValue, serverTimestamp } from "firebase/database";
import { useOnlineUsers } from './useOnlineUsers';
import { useChatMessages } from './useChatMessages';

const useChatManager = (isMinimized, popupsEnabled, isMuted, notificationSound) => {
    const { user, chatStatus } = useAuth();
    const onlineUsers = useOnlineUsers();
    const { 
        messages, 
        isLoading, 
        newNotification, 
        unreadCount, 
        resetUnreadCount, 
        sendMessage, 
        updateMessage, 
        deleteMessage 
    } = useChatMessages({
        chatStatus, isMinimized, popupsEnabled, isMuted, notificationSound
    });

    const [typingUsers, setTypingUsers] = useState([]);

    // Função para o usuário local atualizar seu status de "digitando"
    const updateTypingStatus = useCallback((isTyping) => {
        if (!user || chatStatus !== 'online') return;
        const typingRef = ref(rtdb, `/typing/${user.uid}`);
        
        if (isTyping) {
            set(typingRef, { name: user.name, timestamp: serverTimestamp() });
            // Define um timer para remover o status após alguns segundos,
            // caso o usuário pare de digitar sem enviar a mensagem.
            setTimeout(() => {
                set(typingRef, null);
            }, 4000); // 4 segundos
            // Garante que o status seja removido se o usuário desconectar
            onDisconnect(typingRef).remove();
        } else {
            set(typingRef, null);
        }
    }, [user, chatStatus]);

    // Listener global para monitorar todos os usuários que estão digitando
    useEffect(() => {
        if (!user) return;

        const typingRef = ref(rtdb, '/typing');
        const listener = onValue(typingRef, (snapshot) => {
            const typingData = snapshot.val() || {};
            const now = Date.now();
            
            const currentTypingUsers = Object.keys(typingData)
                // Remove o próprio usuário da lista
                .filter(uid => uid !== user.uid)
                // Considera "digitando" se o timestamp for dos últimos 5 segundos
                .filter(uid => (now - typingData[uid].timestamp) < 5000)
                .map(uid => ({ uid, name: typingData[uid].name }));
            
            setTypingUsers(currentTypingUsers);
        });

        return () => off(typingRef, 'value', listener);
    }, [user]);
    
    // Efeito para zerar o contador de não lidas quando o chat é maximizado
    useEffect(() => {
        if (!isMinimized) {
            resetUnreadCount();
        }
    }, [isMinimized, resetUnreadCount]);

    return {
        messages,
        onlineUsers,
        isLoading,
        newNotification,
        unreadCount,
        typingUsers,
        sendMessage,
        updateMessage,
        deleteMessage,
        updateTypingStatus,
    };
};

export default useChatManager;