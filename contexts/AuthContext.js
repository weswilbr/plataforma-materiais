// NOME DO ARQUIVO: contexts/AuthContext.js
// Lógica de autenticação aprimorada para gerir o estado online do chat de forma mais explícita.
// MODIFICAÇÃO: Adicionado comentário explicativo sobre o objeto 'user'.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, set, serverTimestamp, onDisconnect, remove } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatStatus, setChatStatus] = useState('offline');

    // Função centralizada para atualizar o status na Realtime Database
    const updateUserChatStatus = (state) => {
        if (!user) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);

        if (state === 'online') {
            // Define o utilizador como online e prepara a sua desconexão automática
            set(userStatusRef, { 
                state: 'online', 
                name: user.name, 
                role: user.role, 
                last_changed: serverTimestamp() 
            });
            onDisconnect(userStatusRef).remove();
        } else {
            // Remove o utilizador da lista de status online
            remove(userStatusRef);
        }
        setChatStatus(state);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    // Este objeto 'user' (com uid, email, name, role) é disponibilizado para toda a aplicação
                    // e é essencial para funcionalidades como a Lista de Prospectos, que armazena dados por utilizador.
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
                } else {
                    signOut(auth);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Email ou senha inválidos." };
        }
    };
    
    const logout = async () => {
        if (user) {
            // Garante que o utilizador é removido da lista de online ao deslogar
            const userStatusRef = ref(rtdb, '/status/' + user.uid);
            await remove(userStatusRef);
        }
        await signOut(auth);
        setChatStatus('offline');
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };

    const value = { 
        user, 
        loading, 
        chatStatus, 
        updateUserChatStatus, 
        login, 
        resetPassword, 
        logout 
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
