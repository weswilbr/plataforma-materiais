// NOME DO ARQUIVO: components/PlatformLayout.js
// ATUALIZAÇÃO: A navegação de "Produtos" foi simplificada. Agora, ao clicar no menu,
// o utilizador é levado para uma página de vitrine com todos os produtos (ProductShowcase).
// A lista de produtos foi removida da barra lateral para uma interface mais limpa.

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import InviteGenerator from './InviteGenerator';
import WelcomeScreen from './WelcomeScreen';
import GlobalChat from './GlobalChat';
import ProspectsList from './ProspectsList';
import {
    MaterialViewer, BrochurePresenter, LoyaltyPresenter, TransferFactorPresenter, FactoryPresenter,
    ProductBrowser, OpportunityPresenter, BonusBuilderPresenter, TablesPresenter, GlossaryPresenter,
    RankingPresenter, ChannelsPresenter, ArtsPresenter, MaterialCard, ShareModal, ProductShowcase
} from './materials';
import { materialsMap } from '../data';
import * as Icons from './icons';

// Componente de Tema
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

    // --- Estados para Pesquisa e Partilha ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

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

    // --- Lógica de Pesquisa ---
    const allMaterials = useMemo(() => {
        const flattened = [];
        const seenTitles = new Set();
        
        const addItem = (item) => {
            if (item.title && item.url && !seenTitles.has(item.title)) {
                flattened.push(item);
                seenTitles.add(item.title);
            }
        };

        Object.entries(materialsMap).forEach(([key, data]) => {
            if (['positionsData', 'glossaryTerms', 'individualProducts'].includes(key)) return;
            if (key === 'productData') {
                Object.entries(data).forEach(([prodId, product]) => {
                    Object.entries(product.content).forEach(([contentKey, contentItem]) => {
                        addItem({
                            ...contentItem,
                            id: `product_${prodId}_${contentKey}`,
                            title: `${product.name} - ${contentItem.title}`,
                        });
                    });
                });
            } else if (Array.isArray(data)) {
                data.forEach(item => addItem(item));
            } else if (typeof data === 'object' && data !== null) {
                Object.values(data).forEach(value => {
                    if (Array.isArray(value)) value.forEach(item => addItem(item));
                    else if (typeof value === 'object' && value.title) addItem(value);
                    else if (typeof value === 'object') {
                        Object.values(value).forEach(subItem => addItem(subItem));
                    }
                });
            }
        });
        return flattened;
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        const results = allMaterials.filter(item =>
            item.title.toLowerCase().includes(lowercasedQuery) ||
            (item.description && item.description.toLowerCase().includes(lowercasedQuery))
        );
        setSearchResults(results);
    }, [searchQuery, allMaterials]);
    
    // --- Handlers ---
    const handleMenuClick = (command) => {
        setSearchQuery('');
        if (command === 'chat') {
            if (chatStatus === 'offline') updateUserChatStatus('online');
            setIsChatVisible(!isChatVisible);
        } else {
            setActiveCommand(command);
            setSelectedProductId(null); // Limpa a seleção de produto ao mudar de secção
        }
        setIsSidebarOpen(false);
    };
    
    const handleLogout = async () => { setIsLoggingOut(true); await logout(); };
    const handleOpenShare = (material) => { setSelectedMaterial(material); setShareModalOpen(true); };
    const handleCloseShare = () => setShareModalOpen(false);

    // --- Renderização ---
    const SearchResultsComponent = () => (
        <MaterialViewer title={`Resultados para "${searchQuery}"`}>
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((item, index) => <MaterialCard key={item.id || index} item={item} onShare={handleOpenShare} />)}
                </div>
            ) : (
                <p className="text-center text-slate-500 dark:text-slate-400">Nenhum material encontrado.</p>
            )}
        </MaterialViewer>
    );

    const renderContent = () => {
        if (searchQuery.trim() !== '') return <SearchResultsComponent />;

        // Lógica de navegação para a seção de produtos
        if (activeCommand === 'produtos') {
            if (selectedProductId) {
                // Se um produto está selecionado, mostra os detalhes desse produto
                return <ProductBrowser 
                            initialProductId={selectedProductId} 
                            onShare={handleOpenShare} 
                            onBack={() => setSelectedProductId(null)} // Botão de voltar limpa a seleção
                        />;
            }
            // Se nenhum produto estiver selecionado, mostra a vitrine de todos os produtos
            return <ProductShowcase onProductSelect={(productId) => setSelectedProductId(productId)} />;
        }
        
        const componentMap = {
            'inicio': <WelcomeScreen />, 'convite': <InviteGenerator />, 'prospects': <ProspectsList />,
            'apresentacao': <OpportunityPresenter onShare={handleOpenShare} />,
            'bonusconstrutor': <BonusBuilderPresenter onShare={handleOpenShare} />,
            'fabrica4life': <FactoryPresenter onShare={handleOpenShare} />,
            'fatorestransferencia': <TransferFactorPresenter onShare={handleOpenShare} />,
            'fidelidade': <LoyaltyPresenter onShare={handleOpenShare} />,
            'folheteria': <BrochurePresenter onShare={handleOpenShare} />,
            'artes': <ArtsPresenter onShare={handleOpenShare} />,
            'tabelas': <TablesPresenter />, 'glossario': <GlossaryPresenter />, 'ranking': <RankingPresenter />,
            'canais': <ChannelsPresenter />,
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
                                {commands.map(command => (
                                    <li key={command}>
                                        <button 
                                            onClick={() => handleMenuClick(command)} 
                                            className={`w-full text-left flex items-center gap-4 px-4 py-2.5 rounded-lg ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                            <span className="w-6 h-6">{commandMap[command].icon}</span>
                                            <span>{commandMap[command].title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
            <main className="md:ml-80 h-screen flex flex-col">
                 <header className="md:hidden flex justify-between items-center p-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-xl font-bold">{commandMap[activeCommand]?.title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Icons.MenuIcon /></button>
                 </header>
                 <div className="flex-grow p-6 md:p-10 overflow-y-auto">
                     <div className="relative mb-6">
                         <input 
                            type="text" 
                            placeholder="Pesquisar em todos os materiais..." 
                            className="form-input w-full p-3 pl-10 bg-slate-100 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                         <Icons.SearchIcon />
                     </div>
                     {renderContent()}
                 </div>
            </main>
            {isChatVisible && <GlobalChat isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />}
            {shareModalOpen && selectedMaterial && <ShareModal material={selectedMaterial} onClose={handleCloseShare} />}
        </div>
    );
};

export default PlatformLayout;

