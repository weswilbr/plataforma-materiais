// NOME DO ARQUIVO: contexts/AuthContext.js
// Versão que remove a gestão de presença automática no login.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, set, serverTimestamp } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
                } else {
                    // Se o utilizador está autenticado mas não tem perfil, desloga por segurança.
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
            console.error("Erro no login:", error.code);
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
        // Garante que o utilizador é marcado como offline ao deslogar.
        if(auth.currentUser) {
            const userStatusRef = ref(rtdb, '/status/' + auth.currentUser.uid);
            set(userStatusRef, { state: 'offline', last_changed: serverTimestamp() });
        }
        return signOut(auth);
    };

    const value = { user, loading, login, resetPassword, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

