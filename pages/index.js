// NOME DO ARQUIVO: pages/index.js
// Ponto de entrada da página, corrigido para reagir ao estado de autenticação.

import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../components/LoginScreen';
import PlatformLayout from '../components/PlatformLayout';

// Componente de ecrã de carregamento
const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-indigo-950">
        <div className="loader"></div>
    </div>
);


export default function PlatformPage() {
    const { user, loading } = useAuth();

    // 1. Mostra um ecrã de carregamento enquanto verifica a autenticação
    if (loading) {
        return <LoadingScreen />;
    }

    // 2. Após a verificação, decide qual ecrã mostrar
    return (
        <>
            <Head>
                <title>Plataforma de IA - Equipe de Triunfo</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {user ? <PlatformLayout /> : <LoginScreen />}
        </>
    );
}

