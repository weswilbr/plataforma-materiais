// NOME DO ARQUIVO: contexts/AuthContext.js
// Versão simplificada sem a funcionalidade de apagar o histórico de chat ao sair.

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
    const [chatStatus, setChatStatus] = useState('offline');

    useEffect(() => {
        // Validação básica da configuração do Firebase
        if (!auth.app || !db.app) {
            console.error("A configuração do Firebase está incompleta. Verifique as suas variáveis de ambiente.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() };
                    setUser(userData);
                    
                    const userStatusRef = ref(rtdb, '/status/' + firebaseUser.uid);
                    onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() });
                } else {
                    console.error("Documento do utilizador não encontrado no Firestore. A fazer logout.");
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
             console.error("Erro de login:", error);
             if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                return { success: false, error: "Email ou senha inválidos." };
             }
             if (error.code === 'auth/network-request-failed'){
                return { success: false, error: "Erro de rede. Verifique a sua ligação à internet ou a configuração do Firebase." };
             }
             return { success: false, error: "Ocorreu um erro ao tentar fazer o login." };
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };
    
    // A função de logout foi simplificada para apenas desconectar o utilizador.
    const logout = () => {
        if (user) {
            updateUserChatStatus('offline');
        }
        return signOut(auth);
    };

    const value = { user, loading, chatStatus, updateUserChatStatus, login, resetPassword, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

