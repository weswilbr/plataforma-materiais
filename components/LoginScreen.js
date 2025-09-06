// NOME DO ARQUIVO: components/LoginScreen.js
// Versão aprimorada com design renovado, feedback visual e componentes reutilizáveis.

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// --- Ícones ---
const EyeIcon = ({ closed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {closed ? (<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></>) : (<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></>)}
    </svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);


// --- Componentes Reutilizáveis ---
const AuthInput = ({ id, type, value, onChange, placeholder, children }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            {children}
        </div>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={onChange} 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-900 dark:text-white" 
            placeholder={placeholder}
            required 
        />
    </div>
);

const Alert = ({ message, type }) => {
    const baseClasses = "text-sm text-center p-3 rounded-lg";
    const typeClasses = {
        error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
    };
    return <p className={`${baseClasses} ${typeClasses[type]}`}>{message}</p>;
};


const LoginScreen = () => {
    const [mode, setMode] = useState('login');
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

        try {
            if (mode === 'login') {
                const result = await login(email, password);
                if (!result.success) throw new Error(result.error);
            } else {
                const result = await resetPassword(email);
                if (result.success) {
                    setMessage("Email de recuperação enviado! Verifique a sua caixa de entrada e a pasta de spam.");
                } else {
                    throw new Error(result.error);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-indigo-950 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                     <div className="inline-block bg-white dark:bg-indigo-900 p-4 rounded-full shadow-lg">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                           <LockIcon />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
                        {mode === 'login' ? 'Acesso à Plataforma' : 'Recuperar Senha'}
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {mode === 'login' ? 'Acesso exclusivo para membros da equipe.' : 'Insira o seu email para receber o link.'}
                    </p>
                </div>
                
                <div className="bg-white dark:bg-indigo-900 p-8 rounded-xl shadow-2xl space-y-6">
                    <form className="space-y-6" onSubmit={handleAuthAction}>
                        <div className="space-y-4">
                            <AuthInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="O seu email">
                                <MailIcon />
                            </AuthInput>
                            
                            {mode === 'login' && (
                                <div className="relative">
                                    <AuthInput id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="A sua senha">
                                        <LockIcon />
                                    </AuthInput>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-r-lg"
                                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                                    >
                                        <EyeIcon closed={!showPassword} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && <Alert message={error} type="error" />}
                        {message && <Alert message={message} type="success" />}
                        
                        <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none" disabled={isLoading}>
                            {isLoading ? (<><div className="loader mr-3"></div><span>A processar...</span></>) : (mode === 'login' ? 'Entrar' : 'Enviar Email de Recuperação')}
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
        </div>
    );
};

export default LoginScreen;

