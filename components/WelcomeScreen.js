// NOME DO ARQUIVO: components/WelcomeScreen.js
// Tela de Boas-Vindas com novo layout, ícones SVG e paleta de cores azul marinho.

import { useAuth } from '../contexts/AuthContext';

// --- ÍCONES SVG para os cards ---
const ToolsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
);
const BusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14l6-6-6-6-6 6 6 6Z"/><path d="m2 18 6-6-6-6-6 6 6 6Z"/>
    </svg>
);
const ProductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
);

const WelcomeScreen = () => {
    const { user } = useAuth();
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg animate-fade-in space-y-10">
            {/* Cabeçalho de Boas-Vindas */}
            <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Bem-vindo(a), {user.name}!</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Esta é a sua central de ferramentas e materiais da Equipe de Triunfo. Desenvolvemos este espaço para centralizar todos os recursos que você precisa para impulsionar o seu negócio.
                </p>
            </div>

            {/* Seção de Cards de Funcionalidades */}
            <div>
                <h3 className="text-2xl font-semibold dark:text-white">Comece a Explorar</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Ferramentas com IA */}
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                        <div className="text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-indigo-900 rounded-full p-3 mb-4">
                            <ToolsIcon />
                        </div>
                        <h4 className="text-xl font-bold dark:text-white">Ferramentas com IA</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Gere convites e textos de anúncio personalizados.</p>
                    </div>
                    {/* Card 2: Materiais de Negócio */}
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                        <div className="text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-indigo-900 rounded-full p-3 mb-4">
                           <BusinessIcon />
                        </div>
                        <h4 className="text-xl font-bold dark:text-white">Materiais de Negócio</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Acesse apresentações, planos, tabelas e mais.</p>
                    </div>
                    {/* Card 3: Recursos de Produtos */}
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow flex flex-col items-center">
                        <div className="text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-indigo-900 rounded-full p-3 mb-4">
                            <ProductIcon />
                        </div>
                        <h4 className="text-xl font-bold dark:text-white">Recursos de Produtos</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Explore informações detalhadas e vídeos.</p>
                    </div>
                </div>
            </div>
            
            {/* Aviso de Uso Responsável */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-300">Uso Responsável dos Materiais</h3>
                <p className="mt-4 text-amber-700 dark:text-amber-200">
                    Lembre-se que todos os materiais, especialmente vídeos de profissionais e testemunhos, devem ser utilizados de acordo com as políticas da 4Life.
                    <b> É proibido associar os produtos à cura, tratamento ou prevenção de doenças.</b> Compartilhe com responsabilidade para proteger o seu negócio e a integridade da nossa equipe.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;

