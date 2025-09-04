// NOME DO ARQUIVO: pages/index.js
// Ponto de entrada da página, que renderiza Login ou a Plataforma.

import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../components/LoginScreen';
import PlatformLayout from '../components/PlatformLayout';

export default function PlatformPage() {
    const { user } = useAuth();

    return (
        <>
            <Head>
                <title>Plataforma de IA - Equipe de Triunfo</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* Renderiza a tela de Login ou a Plataforma completa com base no estado de autenticação */}
            {user ? <PlatformLayout /> : <LoginScreen />}
        </>
    );
}

