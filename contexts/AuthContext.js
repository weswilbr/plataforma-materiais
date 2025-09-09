// NOME DO ARQUIVO: contexts/AuthContext.js
// ATUALIZAÇÃO: A persistência da autenticação foi alterada para 'session',
// garantindo que o utilizador seja deslogado ao fechar a aba do navegador.

import { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    setPersistence,
    browserSessionPersistence
} from 'firebase/auth';
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
            onDisconnect(userStatusRef).remove();
        } else {
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
            // Define a persistência da autenticação para a sessão atual do navegador.
            // Isso garante que o usuário seja deslogado ao fechar a aba/navegador.
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, error: "Email ou senha inválidos." };
        }
    };
    
    const logout = async () => {
        if (user) {
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

