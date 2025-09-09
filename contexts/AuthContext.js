// NOME DO ARQUIVO: contexts/AuthContext.js
// REFACTOR: A gestão de presença foi aprimorada com `onDisconnect` do Firebase
// para garantir que o status do usuário seja atualizado de forma fiável.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, set, onDisconnect, serverTimestamp, remove } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatStatus, setChatStatus] = useState('offline');

    // Efeito para gerir a autenticação e a presença do utilizador
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() };
                    setUser(userData);
                    // Configura a presença na Realtime Database assim que o utilizador é autenticado
                    const userStatusRef = ref(rtdb, '/status/' + firebaseUser.uid);
                    onDisconnect(userStatusRef).remove(); // Garante que o estado é limpo se a conexão for perdida
                } else {
                    await signOut(auth);
                    setUser(null);
                }
            } else {
                setUser(null);
                setChatStatus('offline'); // Garante que o estado do chat é 'offline' ao deslogar
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Função centralizada para atualizar o status na Realtime Database
    const updateUserChatStatus = (state) => {
        if (!user) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);

        if (state === 'online') {
            set(userStatusRef, { 
                state: 'online', 
                name: user.name, 
                role: user.role, 
                last_changed: serverTimestamp() 
            });
        } else {
            remove(userStatusRef);
        }
        setChatStatus(state);
    };

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
            await remove(ref(rtdb, '/status/' + user.uid)); // Remove o status ao deslogar manualmente
        }
        await signOut(auth);
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };

    const value = { user, loading, chatStatus, updateUserChatStatus, login, resetPassword, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
