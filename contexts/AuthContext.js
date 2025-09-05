// NOME DO ARQUIVO: contexts/AuthContext.js
// Versão com a nova gestão de estado para o chat independente.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, set, serverTimestamp, onDisconnect } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatStatus, setChatStatus] = useState('offline'); // Novo estado: offline, online, busy

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
                    // Configura a desconexão automática
                    const userStatusRef = ref(rtdb, '/status/' + firebaseUser.uid);
                    onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() });
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

    const updateUserChatStatus = (state) => {
        if (!user) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);
        set(userStatusRef, { state, name: user.name, role: user.role, last_changed: serverTimestamp() });
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

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };
    
    const logout = () => {
        updateUserChatStatus('offline'); // Garante que o utilizador fica offline ao deslogar
        return signOut(auth);
    };

    const value = { user, loading, chatStatus, updateUserChatStatus, login, resetPassword, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

