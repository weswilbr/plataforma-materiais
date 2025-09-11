// NOME DO ARQUIVO: components/WelcomeScreen.js
// VERSÃO APRIMORADA: Branding atualizado, layout modernizado com gradientes,
// ícones aprimorados e hierarquia visual mais clara.

import { useAuth } from '../contexts/AuthContext';

// --- ÍCONES SVG APRIMORADOS ---
const ToolsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
const BusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const ProductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/><path d="M21 14v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
const CommunityIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);


const WelcomeScreen = () => {
    const { user } = useAuth();
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 animate-fade-in space-y-12">
            
            {/* Cabeçalho de Boas-Vindas com Fundo Gradiente */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-xl text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                    Plataforma de Materiais e Ferramentas<br/> para o Negócio <span className="text-blue-600 dark:text-blue-400">4Life</span>
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    {getGreeting()}, <span className="font-semibold">{user?.name}</span>! Bem-vindo(a) à sua central de recursos, criada para impulsionar seu sucesso.
                </p>
            </div>

            {/* Seção de Acessos Rápidos */}
            <div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">Acessos Rápidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Materiais de Negócio */}
                    <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full p-4 mb-4 transition-transform duration-300 group-hover:scale-110">
                           <BusinessIcon className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">Materiais de Negócio</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Acesse apresentações, tabelas e guias de ranking.</p>
                    </div>
                    {/* Card 2: Recursos de Produtos */}
                    <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full p-4 mb-4 transition-transform duration-300 group-hover:scale-110">
                            <ProductIcon className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">Recursos de Produtos</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Explore informações detalhadas, vídeos e folhetos.</p>
                    </div>
                    {/* Card 3: Ferramentas Inteligentes */}
                    <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                        <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-full p-4 mb-4 transition-transform duration-300 group-hover:scale-110">
                            <ToolsIcon className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">Ferramentas Inteligentes</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Gere convites, projete ganhos e simule seu ranking.</p>
                    </div>
                    {/* Card 4: Comunidade & Chat */}
                     <div className="group bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center border-2 border-teal-500/30 dark:border-teal-500/50">
                        <div className="bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/50 dark:to-teal-800/50 rounded-full p-4 mb-4 transition-transform duration-300 group-hover:scale-110">
                            <CommunityIcon className="text-teal-600 dark:text-teal-400" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">Comunidade</h4>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Conecte-se e troque ideias no chat em tempo real.</p>
                    </div>
                </div>
            </div>
            
            {/* Aviso de Uso Responsável */}
            <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border-l-4 border-amber-500 flex items-start space-x-4">
                <div className="flex-shrink-0 text-amber-500 dark:text-amber-400 mt-1">
                    <InfoIcon />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Uso Responsável dos Materiais</h3>
                    <p className="mt-2 text-amber-700 dark:text-amber-400">
                        Lembre-se que todos os materiais devem ser utilizados de acordo com as políticas da 4Life.
                        <b> É proibido associar os produtos à cura ou tratamento de doenças.</b> Compartilhe com responsabilidade.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;