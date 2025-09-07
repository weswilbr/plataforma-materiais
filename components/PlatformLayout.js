// NOME DO ARQUIVO: components/PlatformLayout.js
// Versão aprimorada com logout interativo, melhorias de acessibilidade e ajustes na UI.

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import InviteGenerator from './InviteGenerator';
import WelcomeScreen from './WelcomeScreen';
import GlobalChat from './GlobalChat';
import {
    MaterialViewer, BrochurePresenter, LoyaltyPresenter, TransferFactorPresenter, FactoryPresenter,
    ProductBrowser, OpportunityPresenter, BonusBuilderPresenter, TablesPresenter, GlossaryPresenter,
    RankingPresenter, ChannelsPresenter, MaterialCard, ArtsPresenter
} from './MaterialPresenters';
import { materialsMap } from '../data/materials';

// --- Ícones ---
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const MenuIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const SearchIcon = () => <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;


// --- Componente para alternar o tema ---
const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <button onClick={toggleTheme} className="w-full flex items-center justify-between text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
            <span>Mudar Tema</span>
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
        'inicio': { title: 'Início' },
        'chat': { title: 'Chat Global' },
        'convite': { title: 'Gerador de Convites' },
        'ranking': { title: 'Ranking' },
        'apresentacao': { title: 'Apresentação da Oportunidade' },
        'marketingrede': { title: 'Marketing de Rede' },
        'recompensas2024': { title: 'Plano de Recompensas' },
        'bonusconstrutor': { title: 'Bônus Construtor' },
        'treinamento': { title: 'Treinamentos' },
        'produtos': { title: 'Produtos' },
        'fatorestransferencia': { title: 'Fatores de Transferência' },
        'profissionais': { title: 'Profissionais de Saúde' },
        'fabrica4life': { title: 'Fábrica 4LIFE' },
        'fidelidade': { title: 'Programa de Fidelidade' },
        'glossario': { title: 'Glossário' },
        'tabelas': { title: 'Tabelas' },
        'loja': { title: 'Loja Personalizada' },
        'folheteria': { title: 'Folheteria' },
        'artes': { title: 'Criação de Artes' },
        'canais': { title: 'Canais' },
        'admin_panel': { title: 'Painel de Controle' },
        'manage_users': { title: 'Gerenciar Usuários' },
        'view_stats': { title: 'Ver Estatísticas' }
    };
    
    const getMenuItems = (role) => {
        const baseMenu = {
            "🏠 Início": ['inicio'],
            "💬 Comunidade": ['chat'],
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
    
    const menuItems = getMenuItems(user?.role);

    const handleProductClick = (productId) => {
        setActiveCommand('produtos');
        setSelectedProductId(productId);
        setIsSidebarOpen(false);
    };

    const handleMenuClick = (command) => {
        if (command === 'chat') {
            if (chatStatus === 'offline') {
                updateUserChatStatus('online');
            }
            setIsChatVisible(!isChatVisible);
            setIsSidebarOpen(false);
            return;
        }
        setActiveCommand(command);
        setSelectedProductId(null);
        setIsSidebarOpen(false);
    };
    
    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
        // O onAuthStateChanged listener no AuthContext irá tratar do resto.
    };

    const renderContent = () => {
        if (activeCommand === 'produtos') {
            return <ProductBrowser key={selectedProductId} initialProductId={selectedProductId} onBack={() => handleMenuClick('inicio')} />;
        }
        
        return (
             <div className="animate-fade-in">
                {(() => {
                    switch (activeCommand) {
                        case 'inicio': return <WelcomeScreen onChatClick={() => handleMenuClick('chat')} />;
                        case 'convite': return <InviteGenerator />;
                        case 'apresentacao': return <OpportunityPresenter />;
                        case 'bonusconstrutor': return <BonusBuilderPresenter />;
                        case 'fabrica4life': return <FactoryPresenter />;
                        case 'fatorestransferencia': return <TransferFactorPresenter />;
                        case 'fidelidade': return <LoyaltyPresenter />;
                        case 'folheteria': return <BrochurePresenter />;
                        case 'artes': return <ArtsPresenter />;
                        case 'marketingrede': return <MaterialViewer title={commandMap.marketingrede.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(materialsMap.marketingMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`marketingMaterials.${key}`} />)}</div></MaterialViewer>;
                        case 'recompensas2024': return <MaterialViewer title={commandMap.recompensas2024.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><MaterialCard item={materialsMap.rewardsMaterials.pdf} filePath="rewardsMaterials.pdf" /></div></MaterialViewer>;
                        case 'treinamento': return <MaterialViewer title={commandMap.treinamento.title}><div className="space-y-6">{Object.entries(materialsMap.trainingMaterials).map(([category, items]) => (<div key={category}><h3 className="text-xl font-semibold mb-4">{category}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{items.map((item, index) => <MaterialCard key={item.title} item={{...item, description: `Baixe o arquivo: ${item.title}`}} filePath={`trainingMaterials.${category}[${index}]`} />)}</div></div>))}</div></MaterialViewer>;
                        case 'tabelas': return <TablesPresenter />;
                        case 'glossario': return <GlossaryPresenter />;
                        case 'ranking': return <RankingPresenter />;
                        case 'profissionais': return <MaterialViewer title={commandMap.profissionais.title}><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(materialsMap.professionalTestimonials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`professionalTestimonials.${key}`} />)}</div></MaterialViewer>;
                        case 'canais': return <ChannelsPresenter />;
                        default: return <MaterialViewer title={commandMap[activeCommand]?.title || ''} />;
                    }
                })()}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {isSidebarOpen && (<div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>)}
            
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 w-80 p-6 h-screen overflow-y-auto shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plataforma de Apoio</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" aria-label="Fechar menu">
                            <CloseIcon />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Bem-vindo, {user?.name}!</p>
                    <nav className="space-y-6">
                        {Object.entries(menuItems).map(([category, commands]) => {
                             if (category === "💰 Produtos & Benefícios") {
                                return (
                                    <details key={category} className="group" open>
                                        <summary className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 cursor-pointer list-none flex justify-between items-center">
                                            {category}
                                            <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </summary>
                                        <ul className="space-y-1 mt-2">
                                             {commands.map(command => {
                                                if(command === 'produtos'){
                                                    return (
                                                        <details key={command} className="group/submenu">
                                                            <summary className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium flex justify-between items-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700`}>
                                                                {commandMap[command].title}
                                                                <svg className="w-4 h-4 transform group-open/submenu:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </summary>
                                                            <ul className="space-y-1 pl-4 mt-2 border-l-2 border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                                                                {materialsMap.individualProducts.map(product => (
                                                                    <li key={product.id}>
                                                                         <button onClick={() => handleProductClick(product.id)} className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 text-sm flex items-center gap-3 ${selectedProductId === product.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'} hover:bg-slate-100 dark:hover:bg-slate-700`}>
                                                                            <Image src={product.image} alt={product.name} width={24} height={24} className="rounded-full bg-slate-200 object-contain" />
                                                                            <span>{product.name}</span>
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </details>
                                                    )
                                                }
                                                return (
                                                    <li key={command}><button onClick={() => handleMenuClick(command)} className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{commandMap[command].title}</button></li>
                                                )
                                             })}
                                        </ul>
                                    </details>
                                )
                             }
                             return (
                                <details key={category} className="group" open>
                                     <summary className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 cursor-pointer list-none flex justify-between items-center">
                                        {category}
                                        <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </summary>
                                    <ul className="space-y-1 mt-2">
                                        {commands.map(command => (<li key={command}><button onClick={() => handleMenuClick(command)} className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{commandMap[command].title}</button></li>))}
                                    </ul>
                                </details>
                            )
                        })}
                    </nav>
                </div>
                <div>
                    <ThemeSwitcher />
                    <button onClick={handleLogout} disabled={isLoggingOut} className="w-full mt-2 text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center justify-between disabled:opacity-70">
                        <span>{isLoggingOut ? 'A Sair...' : 'Sair da Conta'}</span>
                        {isLoggingOut ? <div className="loader"></div> : <LogoutIcon />}
                    </button>
                </div>
            </aside>
            
            <main className="md:ml-80 h-screen flex flex-col">
                 <header className="md:hidden flex justify-between items-center p-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{activeCommand === 'produtos' && selectedProductId ? materialsMap.productData[selectedProductId]?.name : commandMap[activeCommand]?.title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Abrir menu">
                        <MenuIcon />
                    </button>
                 </header>
                 <div className="flex-grow p-6 md:p-10 overflow-y-auto">
                     {/* Placeholder para a barra de pesquisa */}
                     <div className="relative mb-6">
                         <input
                             type="text"
                             placeholder="Pesquisar materiais (em breve)..."
                             className="w-full p-3 pl-10 bg-slate-100 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                             disabled // Esta funcionalidade será implementada no futuro
                         />
                         <SearchIcon />
                     </div>

                     {renderContent()}
                 </div>
            </main>

            {/* O Chat só é renderizado se estiver visível */}
            {isChatVisible && (
                <GlobalChat isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />
            )}
        </div>
    );
};

export default PlatformLayout;

