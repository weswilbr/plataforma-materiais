// NOME DO ARQUIVO: components/PlatformLayout.js
// Componente principal do layout com novo design e correção para o menu no desktop.

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InviteGenerator from './InviteGenerator';
import WelcomeScreen from './WelcomeScreen';
import {
    MaterialViewer, BrochurePresenter, LoyaltyPresenter, TransferFactorPresenter, FactoryPresenter,
    ProductBrowser, OpportunityPresenter, BonusBuilderPresenter, TablesPresenter, GlossaryPresenter,
    RankingPresenter, ChannelsPresenter, MaterialCard, ArtsPresenter
} from './MaterialPresenters';

// Importa os dados necessários.
import { marketingMaterials, rewardsMaterials, trainingMaterials, professionalTestimonials } from '../data/materials';


const PlatformLayout = () => {
    const [activeCommand, setActiveCommand] = useState('inicio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();

    const commandMap = {
        'inicio': { title: 'Início' }, 'marketingrede': { title: 'Marketing de Rede' }, 'apresentacao': { title: 'Apresentação da Oportunidade' }, 'recompensas2024': { title: 'Plano de Recompensas' }, 'bonusconstrutor': { title: 'Bônus Construtor' }, 'treinamento': { title: 'Treinamentos' }, 'ranking': { title: 'Ranking' }, 'glossario': { title: 'Glossário' }, 'tabelas': { title: 'Tabelas' }, 'produtos': { title: 'Produtos' }, 'fabrica4life': { title: 'Fábrica 4LIFE' }, 'fatorestransferencia': { title: 'Fatores de Transferência' }, 'profissionais': { title: 'Profissionais de Saúde' }, 'fidelidade': { title: 'Programa de Fidelidade' }, 'loja': { title: 'Loja Personalizada' }, 'folheteria': { title: 'Folheteria' }, 'artes': { title: 'Criação de Artes' }, 'canais': { title: 'Canais' }, 'convite': { title: 'Gerador de Convites' },
        'admin_panel': { title: 'Painel de Controle' }, 'manage_users': { title: 'Gerenciar Usuários' }, 'view_stats': { title: 'Ver Estatísticas' }
    };

    const getMenuItems = (role) => {
        const baseMenu = {
            "🏠 Início": ['inicio'],
            "⚙️ Ferramentas IA": ['convite'],
            "🚀 Negócios & Treinamentos": ['ranking', 'apresentacao', 'marketingrede', 'recompensas2024', 'bonusconstrutor', 'treinamento'],
            "💰 Produtos & Benefícios": ['produtos', 'fatorestransferencia', 'profissionais', 'fabrica4life', 'fidelidade', 'glossario', 'tabelas',  'loja'],
            "📣 Materiais Promocionais": ['folheteria', 'artes', 'canais'],
        };
        if (role === 'admin') {
            baseMenu["👑 Painel de Admin"] = ['admin_panel', 'manage_users', 'view_stats'];
        }
        return baseMenu;
    };
    
    const menuItems = getMenuItems(user.role);

    const renderContent = () => {
        switch (activeCommand) {
            case 'inicio': return <WelcomeScreen />;
            case 'convite': return <InviteGenerator />;
            case 'produtos': return <ProductBrowser />;
            case 'apresentacao': return <OpportunityPresenter />;
            case 'bonusconstrutor': return <BonusBuilderPresenter />;
            case 'fabrica4life': return <FactoryPresenter />;
            case 'fatorestransferencia': return <TransferFactorPresenter />;
            case 'fidelidade': return <LoyaltyPresenter />;
            case 'folheteria': return <BrochurePresenter />;
            case 'artes': return <ArtsPresenter />;
            case 'marketingrede': return <MaterialViewer title={commandMap.marketingrede.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.values(marketingMaterials).map(item => <MaterialCard key={item.title} item={item} />)}</div></MaterialViewer>;
            case 'recompensas2024': return <MaterialViewer title={commandMap.recompensas2024.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><MaterialCard item={rewardsMaterials.pdf} /></div></MaterialViewer>;
            case 'treinamento': return <MaterialViewer title={commandMap.treinamento.title}><div className="space-y-6">{Object.entries(trainingMaterials).map(([category, items]) => (<div key={category}><h3 className="text-xl font-semibold mb-4">{category}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{items.map(item => <MaterialCard key={item.title} item={{...item, description: `Baixe o arquivo: ${item.title}`}} />)}</div></div>))}</div></MaterialViewer>;
            case 'tabelas': return <TablesPresenter />;
            case 'glossario': return <GlossaryPresenter />;
            case 'ranking': return <RankingPresenter />;
            case 'profissionais': return <MaterialViewer title={commandMap.profissionais.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.values(professionalTestimonials).map(item => <MaterialCard key={item.title} item={item} />)}</div></MaterialViewer>;
            case 'canais': return <ChannelsPresenter />;
            default: return <MaterialViewer title={commandMap[activeCommand]?.title || ''} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {isSidebarOpen && (<div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}
            
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 w-80 p-6 h-screen overflow-y-auto shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plataforma de Apoio</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Bem-vindo, {user.name}!</p>
                    <nav className="space-y-6">
                        {Object.entries(menuItems).map(([category, commands]) => (
                            <div key={category}>
                                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{category}</h2>
                                <ul className="space-y-1">
                                    {commands.map(command => (
                                        <li key={command}>
                                            <button 
                                                onClick={() => { setActiveCommand(command); setIsSidebarOpen(false); }} 
                                                className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                            >
                                                {commandMap[command].title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
                <button onClick={logout} className="w-full mt-6 text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">Sair da Conta</button>
            </aside>
            
            <main className="md:ml-80 p-6 md:p-10 h-screen overflow-y-auto">
                 <header className="md:hidden flex justify-between items-center mb-6 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm -mx-6 px-6 py-4 z-10 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{commandMap[activeCommand]?.title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                 </header>
                 <div className="animate-fade-in">
                    {renderContent()}
                 </div>
            </main>
        </div>
    );
};

export default PlatformLayout;

