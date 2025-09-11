// NOME DO ARQUIVO: contexts/AuthContext.js
// ATUALIZAÇÃO: Adicionada a função 'setOtherUserChatStatus' para permitir
// que administradores modifiquem o status de outros utilizadores no chat.

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
import { ref, set, serverTimestamp, onDisconnect, onValue, off } from "firebase/database";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatStatus, setChatStatus] = useState('offline');

    // Monitora o status da conexão com o Realtime Database
    useEffect(() => {
        if (!user) return;

        const userStatusRef = ref(rtdb, '/status/' + user.uid);
        const connectedRef = ref(rtdb, '.info/connected');

        const listener = onValue(connectedRef, (snap) => {
            if (snap.val() === true && chatStatus !== 'offline') {
                set(userStatusRef, { 
                    state: chatStatus, 
                    name: user.name, 
                    role: user.role, 
                    last_changed: serverTimestamp() 
                });
                onDisconnect(userStatusRef).remove();
            }
        });

        return () => {
            off(connectedRef, 'value', listener);
        };
    }, [user, chatStatus]);

    const updateUserChatStatus = useCallback((state) => {
        if (!user) return;
        const userStatusRef = ref(rtdb, '/status/' + user.uid);

        if (state === 'online' || state === 'busy' || state === 'away') {
            set(userStatusRef, { 
                state: state, 
                name: user.name, 
                role: user.role, 
                last_changed: serverTimestamp() 
            });
        } else {
            set(userStatusRef, null);
        }
        setChatStatus(state);
    }, [user]);

    // NOVA FUNÇÃO PARA ADMINS
    const setOtherUserChatStatus = useCallback(async (targetUser, newState) => {
        // Verificação de segurança no cliente: só continua se o usuário atual for admin
        if (!user || user.role !== 'admin' || !targetUser) return;
        
        const targetUserStatusRef = ref(rtdb, '/status/' + targetUser.uid);
        
        if (newState === 'offline') {
             await set(targetUserStatusRef, null);
        } else {
            // Usa os dados do 'targetUser' para manter a consistência
            await set(targetUserStatusRef, {
                state: newState,
                name: targetUser.name,
                role: targetUser.role,
                last_changed: serverTimestamp()
            });
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
                } else {
                    await signOut(auth);
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
            await setPersistence(auth, browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            let message = "Email ou senha inválidos.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = "As credenciais fornecidas estão incorretas.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Acesso temporariamente bloqueado. Tente novamente mais tarde.";
            }
            return { success: false, error: message };
        }
    };
    
    const logout = async () => {
        if (user) {
            const userStatusRef = ref(rtdb, '/status/' + user.uid);
            await set(userStatusRef, null);
        }
        await signOut(auth);
        setChatStatus('offline');
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            let message = "Não foi possível enviar o email de recuperação.";
            if (error.code === 'auth/user-not-found') {
                message = "Nenhuma conta encontrada com este endereço de email.";
            }
            return { success: false, error: message };
        }
    };

    const value = useMemo(() => ({
        user, 
        loading, 
        chatStatus, 
        updateUserChatStatus, 
        setOtherUserChatStatus, // Exporta a nova função
        login, 
        resetPassword, 
        logout 
    }), [user, loading, chatStatus, updateUserChatStatus, setOtherUserChatStatus]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}