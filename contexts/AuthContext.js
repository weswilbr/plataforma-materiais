// NOME DO ARQUIVO: contexts/AuthContext.js
// APRIMORAMENTO: O valor do provider foi memoizado para otimizar performance.
// A lógica de presença foi aprimorada para usar o monitoramento de conexão nativo
// do Firebase (.info/connected), tornando-a mais resiliente a múltiplas abas e
// perdas de conexão temporárias.

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
            if (snap.val() === true && chatStatus === 'online') {
                // Se a conexão for reestabelecida e o status desejado é 'online',
                // redefinimos o status.
                set(userStatusRef, { 
                    state: 'online', 
                    name: user.name, 
                    role: user.role, 
                    last_changed: serverTimestamp() 
                });
                // Garante que o status será removido se a conexão cair novamente.
                onDisconnect(userStatusRef).remove();
            }
        });

        return () => {
            // Remove o listener quando o usuário desloga ou o componente é desmontado.
            off(connectedRef, 'value', listener);
        };
    }, [user, chatStatus]);


    const updateUserChatStatus = useCallback((state) => {
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
            set(userStatusRef, null); // Usar set(ref, null) é o mesmo que remove(ref)
        }
        setChatStatus(state);
    }, [user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists()) {
                    const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() };
                    setUser(userData);
                } else {
                    await signOut(auth); // Garante que o signOut complete antes de setar user como null
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
            // Mapeamento de erros para feedback mais útil
            let message = "Email ou senha inválidos.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                message = "As credenciais fornecidas estão incorretas.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Acesso temporariamente bloqueado devido a muitas tentativas. Tente novamente mais tarde.";
            }
            return { success: false, error: message };
        }
    };
    
    const logout = async () => {
        if (user) {
            // Ao deslogar, remove o status de presença
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

    // Memoiza o objeto 'value' para evitar re-renderizações desnecessárias nos componentes consumidores
    const value = useMemo(() => ({
        user, 
        loading, 
        chatStatus, 
        updateUserChatStatus, 
        login, 
        resetPassword, 
        logout 
    }), [user, loading, chatStatus, updateUserChatStatus]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}