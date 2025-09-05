// NOME DO ARQUIVO: contexts/AuthContext.js
// Lógica de autenticação que agora gere o status de presença online.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, rtdb } from '../firebase'; // Importa a rtdb
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp } from "firebase/database"; // Importa funções da rtdb

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
                
                const userStatusRef = ref(rtdb, '/status/' + firebaseUser.uid);

                if (userDoc.exists()) {
                    const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() };
                    setUser(userData);

                    // Lógica de Presença Online
                    onValue(ref(rtdb, '.info/connected'), (snapshot) => {
                        if (snapshot.val() === false) {
                            return;
                        }
                        onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() }).then(() => {
                            set(userStatusRef, { state: 'online', last_changed: serverTimestamp() });
                        });
                    });
                } else {
                    console.error("Utilizador autenticado mas sem perfil no Firestore.");
                    // Para login com Google, poderíamos criar um perfil aqui.
                    // Como o registo é fechado, vamos apenas deslogar.
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
            console.error("Erro ao redefinir senha:", error.code);
            return { success: false, error: "Não foi possível enviar o email de recuperação." };
        }
    };
    
    const logout = () => {
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

