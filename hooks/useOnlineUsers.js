// NOME DO ARQUIVO: hooks/useOnlineUsers.js
// CORREÇÃO: O estado 'onlineUsers' foi inicializado com um array vazio '[]'
// para prevenir o erro 'cannot read .length' durante a renderização inicial.

import { useState, useEffect } from 'react';
import { ref, onValue, off } from "firebase/database"; // Adicionado 'off' para limpeza
import { rtdb } from '../firebase';

export const useOnlineUsers = () => {
    // <<< CORREÇÃO CRÍTICA AQUI >>>
    // Inicializa o estado com um array vazio para garantir que '.length' nunca falhe.
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const statusRef = ref(rtdb, '/status');
        
        const listener = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val() || {};
            
            const online = Object.keys(statuses)
                .map(uid => ({ uid, ...statuses[uid] }))
                .filter(user => user.state === 'online' || user.state === 'busy');

            setOnlineUsers(online);
        });

        // Limpa o listener quando o componente que usa o hook é desmontado
        return () => off(statusRef, 'value', listener);
    }, []);

    return onlineUsers;
};