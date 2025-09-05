// NOME DO ARQUIVO: components/LoginScreen.js
// Versão segura sem registo público e sem login com Google.

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// --- Ícones ---
const EyeIcon = ({ closed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {closed ? (<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></>) : (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></>)}
    </svg>
);

const LoginScreen = () => {
    const [mode, setMode] = useState('login'); // 'login' ou 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, resetPassword } = useAuth();

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        let result;
        if (mode === 'login') {
            result = await login(email, password);
        } else if (mode === 'reset') {
            result = await resetPassword(email);
            if(result.success) setMessage("Email de recuperação enviado! Verifique a sua caixa de entrada.");
        }
        
        if (result && !result.success) setError(result.error);

        setIsLoading(false);
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-indigo-950">
            <div className="w-full min-h-screen p-8 space-y-6 bg-white dark:bg-indigo-900 flex flex-col justify-center md:min-h-0 md:w-full md:max-w-md md:h-auto md:rounded-xl md:shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {mode === 'login' ? 'Bem-vindo à Plataforma' : 'Recuperar Senha'}
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {mode === 'login' ? 'Acesso exclusivo para membros da equipe.' : 'Insira o seu email para receber o link de recuperação'}
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleAuthAction}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" required />
                    </div>
                    
                    {mode === 'login' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full px-4 py-2 pr-10 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                                    required 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                >
                                    <EyeIcon closed={!showPassword} />
                                </button>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                    
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:bg-slate-400" disabled={isLoading}>
                        {isLoading ? (<><div className="loader mr-3"></div><span>A processar...</span></>) : (mode === 'login' ? 'Entrar' : 'Enviar Email')}
                    </button>
                </form>

                <div className="text-sm text-center">
                    {mode === 'login' ? (
                        <button onClick={() => { setMode('reset'); setError(''); }} className="font-medium text-slate-500 hover:underline dark:text-slate-400">Esqueceu-se da senha?</button>
                    ) : (
                        <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="font-medium text-blue-600 hover:underline dark:text-blue-400">Voltar para o Login</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;

