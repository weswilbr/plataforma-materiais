// NOME DO ARQUIVO: hooks/useOnlineUsers.js
// RESPONSABILIDADE: Isola a lógica de busca de usuários online do Realtime Database.
// APRIMORAMENTO: Lógica de mapeamento simplificada e estado inicializado como array vazio.

import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { rtdb } from '../firebase';

export const useOnlineUsers = () => {
    // Inicializa com array vazio para evitar erros de 'length' na UI
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const statusRef = ref(rtdb, '/status');
        
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const statuses = snapshot.val() || {};
            
            // Mapeamento conciso usando Object.keys e filter
            const online = Object.keys(statuses)
                .map(uid => ({ uid, ...statuses[uid] }))
                .filter(user => user.state === 'online' || user.state === 'busy');

            setOnlineUsers(online);
        });

        // Limpa o listener quando o componente que usa o hook é desmontado
        return () => unsubscribeStatus();
    }, []);

    return onlineUsers;
};