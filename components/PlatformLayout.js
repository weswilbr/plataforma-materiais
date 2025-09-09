// NOME DO ARQUIVO: components/PlatformLayout.js
// ATUALIZAÇÃO: Componente totalmente refatorado para usar a nova estrutura de componentes e dados,
// tornando a lógica de renderização muito mais limpa e escalável.

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import InviteGenerator from './InviteGenerator';
import WelcomeScreen from './WelcomeScreen';
import GlobalChat from './GlobalChat';
import ProspectsList from './ProspectsList';
import {
    MaterialViewer, BrochurePresenter, LoyaltyPresenter, TransferFactorPresenter, FactoryPresenter,
    ProductBrowser, OpportunityPresenter, BonusBuilderPresenter, TablesPresenter, GlossaryPresenter,
    RankingPresenter, ChannelsPresenter, ArtsPresenter
} from './materials';
import { materialsMap } from '../data';
import * as Icons from './icons';

// Componente de Tema (sem alterações)
const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };
    return (
        <button onClick={toggleTheme} title="Mudar Tema" className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
    );
};

const PlatformLayout = () => {
    const [activeCommand, setActiveCommand] = useState('inicio');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, logout, chatStatus, updateUserChatStatus } = useAuth();
    const [isChatVisible, setIsChatVisible] = useState(false);

    const commandMap = {
        'inicio': { title: 'Início', icon: <Icons.HomeIcon /> },
        'chat': { title: 'Chat Global', icon: <Icons.ChatIcon /> },
        'prospects': { title: 'Lista de Prospectos', icon: <Icons.ClipboardListIcon /> },
        'convite': { title: 'Gerador de Convites', icon: <Icons.SparklesIcon /> },
        'ranking': { title: 'Ranking', icon: <Icons.TrophyIcon /> },
        'apresentacao': { title: 'Apresentação', icon: <Icons.PresentationIcon /> },
        'marketingrede': { title: 'Marketing de Rede', icon: <Icons.NetworkIcon /> },
        'recompensas2024': { title: 'Recompensas', icon: <Icons.GiftIcon /> },
        'bonusconstrutor': { title: 'Bônus Construtor', icon: <Icons.BuildingIcon /> },
        'treinamento': { title: 'Treinamentos', icon: <Icons.BookOpenIcon /> },
        'produtos': { title: 'Produtos', icon: <Icons.PackageIcon /> },
        'fatorestransferencia': { title: 'Fatores de Transferência', icon: <Icons.DnaIcon /> },
        'profissionais': { title: 'Profissionais de Saúde', icon: <Icons.UsersIcon /> },
        'fabrica4life': { title: 'Fábrica 4LIFE', icon: <Icons.FactoryIcon /> },
        'fidelidade': { title: 'Programa de Fidelidade', icon: <Icons.StarIcon /> },
        'glossario': { title: 'Glossário', icon: <Icons.HelpCircleIcon /> },
        'tabelas': { title: 'Tabelas', icon: <Icons.TableIcon /> },
        'loja': { title: 'Loja Personalizada', icon: <Icons.StoreIcon /> },
        'folheteria': { title: 'Folheteria', icon: <Icons.NewspaperIcon /> },
        'artes': { title: 'Criação de Artes', icon: <Icons.PaletteIcon /> },
        'canais': { title: 'Canais', icon: <Icons.ChannelsIcon /> },
    };
    
    const menuItems = {
        "Geral": ['inicio', 'chat'],
        "Ferramentas": ['convite', 'prospects'],
        "Negócio": ['ranking', 'apresentacao', 'marketingrede', 'recompensas2024', 'bonusconstrutor', 'treinamento'],
        "Recursos": ['produtos', 'fatorestransferencia', 'profissionais', 'fabrica4life', 'fidelidade', 'glossario', 'tabelas',  'loja'],
        "Marketing": ['folheteria', 'artes', 'canais'],
    };

    const handleMenuClick = (command, productId = null) => {
        if (command === 'chat') {
            if (chatStatus === 'offline') updateUserChatStatus('online');
            setIsChatVisible(!isChatVisible);
        } else {
            setActiveCommand(command);
            setSelectedProductId(productId);
        }
        setIsSidebarOpen(false);
    };
    
    const handleLogout = async () => { setIsLoggingOut(true); await logout(); };

    const renderContent = () => {
        const componentMap = {
            'inicio': <WelcomeScreen />,
            'convite': <InviteGenerator />,
            'prospects': <ProspectsList />,
            'apresentacao': <OpportunityPresenter />,
            'bonusconstrutor': <BonusBuilderPresenter />,
            'fabrica4life': <FactoryPresenter />,
            'fatorestransferencia': <TransferFactorPresenter />,
            'fidelidade': <LoyaltyPresenter />,
            'folheteria': <BrochurePresenter />,
            'artes': <ArtsPresenter />,
            'tabelas': <TablesPresenter />,
            'glossario': <GlossaryPresenter />,
            'ranking': <RankingPresenter />,
            'canais': <ChannelsPresenter />,
            'produtos': <ProductBrowser initialProductId={selectedProductId} onBack={() => handleMenuClick('inicio')} />,
            // Adicione outros componentes aqui
        };

        const ActiveComponent = componentMap[activeCommand];
        return ActiveComponent || <MaterialViewer title={commandMap[activeCommand]?.title} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {isSidebarOpen && (<div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 w-80 p-6 h-screen shadow-2xl flex flex-col transform transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plataforma</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><Icons.CloseIcon /></button>
                </div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bem-vindo, {user?.name}!</p>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <button onClick={handleLogout} disabled={isLoggingOut} title="Sair da Conta" className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-70">{isLoggingOut ? <div className="loader h-5 w-5"></div> : <Icons.LogoutIcon />}</button>
                    </div>
                </div>
                <nav className="flex-grow space-y-6 overflow-y-auto -mr-3 pr-3">
                    {Object.entries(menuItems).map(([category, commands]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-4">{category}</h3>
                            <ul className="space-y-1">
                                {commands.map(command => command === 'produtos' ? (
                                    <li key={command}>
                                        <details className="group/submenu">
                                            <summary className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg cursor-pointer list-none ${activeCommand === command ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                                <div className="flex items-center gap-4"><span className="w-6 h-6">{commandMap[command].icon}</span><span>{commandMap[command].title}</span></div>
                                                <svg className="w-4 h-4 transform group-open/submenu:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </summary>
                                            <ul className="pl-6 mt-2 border-l-2 border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                                                {materialsMap.individualProducts.map(p => (
                                                    <li key={p.id}><button onClick={() => handleMenuClick('produtos', p.id)} className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-3 ${selectedProductId === p.id ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><Image src={p.image} alt={p.name} width={24} height={24} className="rounded-full bg-slate-200 object-contain" /><span>{p.name}</span></button></li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                ) : (
                                    <li key={command}><button onClick={() => handleMenuClick(command)} className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded-lg ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><span className="w-6 h-6">{commandMap[command].icon}</span><span>{commandMap[command].title}</span></button></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
            <main className="md:ml-80 h-screen flex flex-col">
                 <header className="md:hidden flex justify-between items-center p-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold">{activeCommand === 'produtos' && selectedProductId ? materialsMap.productData[selectedProductId]?.name : commandMap[activeCommand]?.title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Icons.MenuIcon /></button>
                 </header>
                 <div className="flex-grow p-6 md:p-10 overflow-y-auto">
                     <div className="relative mb-6">
                         <input type="text" placeholder="Pesquisar materiais (em breve)..." className="form-input w-full p-3 pl-10 bg-slate-100 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60" disabled />
                         <Icons.SearchIcon />
                     </div>
                     {renderContent()}
                 </div>
            </main>
            {isChatVisible && <GlobalChat isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />}
        </div>
    );
};

export default PlatformLayout;


