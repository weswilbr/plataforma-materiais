// NOME DO ARQUIVO: pages/index.js
// Este é o ponto de entrada da sua página.

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
            
            {user ? <PlatformLayout /> : <LoginScreen />}
        </>
    );
}

