// NOME DO ARQUIVO: contexts/AuthContext.js
// Versão com a nova gestão de estado para o chat independente e funcionalidade de apagar histórico.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
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
    
    const logout = async () => {
        if (!user) {
            return signOut(auth);
        }

        // Apaga o histórico de chat apenas se o utilizador não for 'admin'
        if (user.role !== 'admin') {
            try {
                const q = query(collection(db, "chatMessages"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const batch = writeBatch(db);
                    querySnapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                }
            } catch (error) {
                console.error("Erro ao apagar o histórico de chat:", error);
                // O logout prossegue mesmo que a exclusão falhe, para não prender o utilizador.
            }
        }

        updateUserChatStatus('offline');
        return signOut(auth);
    };

    const value = { user, loading, chatStatus, updateUserChatStatus, login, resetPassword, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
