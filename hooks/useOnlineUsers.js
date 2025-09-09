// NOME DO ARQUIVO: hooks/useOnlineUsers.js
// REFACTOR: Hook customizado para isolar a lógica de busca de usuários online do Realtime Database.

import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { rtdb } from '../firebase';

export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const statusRef = ref(rtdb, '/status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val();
            const online = [];
            if (statuses) {
                for (const uid in statuses) {
                    if (statuses[uid].state === 'online' || statuses[uid].state === 'busy') {
                        online.push({ uid, ...statuses[uid] });
                    }
                }
            }
            setOnlineUsers(online);
        });

        return () => unsubscribeStatus();
    }, []);

    return onlineUsers;
};
