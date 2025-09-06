// NOME DO ARQUIVO: contexts/AuthContext.js
// Versão simplificada focada apenas no login com email/senha e recuperação de senha.

import { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db, rtdb, firebaseConfigError } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, set, onDisconnect } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const [chatStatus, setChatStatus] = useState('offline');

    useEffect(() => {
        if (firebaseConfigError) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
                    const userStatusRef = ref(rtdb, '/status/' + firebaseUser.uid);
                    onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() });
                } else {
                    // Se o documento não existir, pode ser um utilizador de um sistema antigo.
                    // Vamos criar um para ele.
                    await setDoc(userDocRef, {
                        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        role: "user",
                        createdAt: serverTimestamp()
                    });
                    const freshSnap = await getDoc(userDocRef);
                    setUser({ uid: firebaseUser.uid, ...freshSnap.data() });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateUserChatStatus = (state) => {
        if (!user || firebaseConfigError) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);
        set(userStatusRef, { state, name: user.name, role: user.role, last_changed: serverTimestamp() });
        setChatStatus(state);
    };

    const login = async (email, password) => {
        if (firebaseConfigError) return { success: false, error: "Erro de configuração. Contacte o administrador." };
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Email ou senha inválidos." };
        }
    };
    
    const resetPassword = async (email) => {
        if (firebaseConfigError) return { success: false, error: "Erro de configuração." };
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };
    
    const logout = async () => {
        if (!auth.currentUser) return;
        setIsLogoutLoading(true);
        try {
            if (user && user.role !== 'admin') {
                const messagesQuery = query(collection(db, "chatMessages"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(messagesQuery);
                const batch = writeBatch(db);
                querySnapshot.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
            }
            updateUserChatStatus('offline');
            await signOut(auth);
        } catch (error) {
            console.error("Erro durante o logout:", error);
        } finally {
            setIsLogoutLoading(false);
        }
    };

    const value = { 
        user, 
        loading, 
        isLogoutLoading, 
        firebaseConfigError, 
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

