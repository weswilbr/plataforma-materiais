// NOME DO ARQUIVO: components/LoginScreen.js
// Tela de Login com a nova paleta de cores.

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const handleSubmit = (e) => { e.preventDefault(); setError(''); const success = login(username, password); if (!success) { setError('Nome de usuário ou senha inválidos.'); } };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-indigo-950">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-indigo-900 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bem-vindo à Plataforma</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Faça login para continuar</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Usuário</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" placeholder="admin ou user" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" placeholder="senha" />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;

