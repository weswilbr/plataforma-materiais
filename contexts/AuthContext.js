// NOME DO ARQUIVO: contexts/AuthContext.js
// Lógica de autenticação integrada com o Firebase, corrigida para gerir o estado de loading.

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para gerir o carregamento inicial

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Se houver um utilizador no Firebase, busca o perfil dele no Firestore
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        ...userDoc.data()
                    });
                } else {
                    // Caso de erro: utilizador autenticado mas sem perfil
                    console.error("Utilizador autenticado mas sem perfil no Firestore.");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false); // Finaliza o carregamento após verificar
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error("Erro no login:", error.message);
            return false;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = { user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

