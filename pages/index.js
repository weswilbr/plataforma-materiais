// NOME DO ARQUIVO: pages/index.js
// DESCRIÇÃO: Ponto de entrada da aplicação. Verifica o estado de autenticação para renderizar a página de login ou a plataforma.

import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../components/LoginScreen';
import PlatformLayout from '../components/PlatformLayout';

const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-indigo-950">
        <div className="loader" style={{width: '40px', height: '40px', borderTopColor: '#4f46e5'}}></div>
    </div>
);

export default function PlatformPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Head>
                <title>Plataforma - Equipe de Triunfo</title>
                <meta name="description" content="Plataforma de ferramentas e materiais para membros da Equipe de Triunfo." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {user ? <PlatformLayout /> : <LoginScreen />}
        </>
    );
}
