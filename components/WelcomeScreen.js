// NOME DO ARQUIVO: components/WelcomeScreen.js
// Tela de Boas-Vindas com a nova paleta de cores.

import { useAuth } from '../contexts/AuthContext';

const WelcomeScreen = () => {
    const { user } = useAuth();
    return (
        <div className="bg-white dark:bg-indigo-900 p-8 rounded-lg shadow-lg animate-fade-in space-y-10">
            <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Bem-vindo(a), {user.name}!</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                    Esta é a sua central de ferramentas e materiais da Equipe de Triunfo. Desenvolvemos este espaço para centralizar todos os recursos que você precisa para impulsionar o seu negócio.
                </p>
            </div>

            <div>
                <h3 className="text-2xl font-semibold dark:text-white">Comece a Explorar</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">⚙️</div>
                        <h4 className="text-xl font-bold dark:text-white">Ferramentas com IA</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Gere convites e textos de anúncio personalizados.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🚀</div>
                        <h4 className="text-xl font-bold dark:text-white">Materiais de Negócio</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Acesse apresentações, planos, tabelas e mais.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-indigo-800/50 p-6 rounded-lg text-center hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">💰</div>
                        <h4 className="text-xl font-bold dark:text-white">Recursos de Produtos</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Explore informações detalhadas e vídeos.</p>
                    </div>
                </div>
            </div>
            
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

