// NOME DO ARQUIVO: contexts/AuthContext.js
// Gerencia o estado de autenticação (quem está logado e qual o seu perfil).

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Para este exemplo, usamos uma lista de usuários "mock".
// Numa aplicação real, isto viria de uma base de dados.
const mockUsers = [
    { id: 1, username: 'admin', password: 'password', role: 'admin', name: 'Administrador' },
    { id: 2, username: 'user', password: 'password', role: 'user', name: 'Usuário Padrão' },
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (username, password) => {
        const foundUser = mockUsers.find(u => u.username === username && u.password === password);
        if (foundUser) {
            setUser({ username: foundUser.username, role: foundUser.role, name: foundUser.name });
            return true; // Sucesso no login
        }
        return false; // Falha no login
    };

    const logout = () => {
        setUser(null);
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

