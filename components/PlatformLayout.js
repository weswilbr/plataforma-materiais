// NOME DO ARQUIVO: components/PlatformLayout.js
// CORREÇÃO: A importação de 'materialsMap' foi ajustada para usar o novo
// ficheiro agregador 'data/index.js', resolvendo o erro "Cannot convert undefined or null to object".

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
import { materialsMap } from '../data'; // <-- IMPORTAÇÃO CORRIGIDA
import * as Icons from './icons';
import ThemeSwitcher from './ThemeSwitcher';

const PlatformLayout = () => {
    const [activeCommand, setActiveCommand] = useState('inicio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [productView, setProductView] = useState('showcase'); // 'showcase' ou 'detail'
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // --- Lógica de Pesquisa ---
    const allMaterials = useMemo(() => {
        const flattened = [];
        const seenTitles = new Set();
        
        const addItem = (item) => {
            if (item && item.title && item.url && !seenTitles.has(item.title)) {
                flattened.push(item);
                seenTitles.add(item.title);
            }
        };

        if (!materialsMap || typeof materialsMap !== 'object') {
            console.error("materialsMap não está a ser carregado corretamente. Verifique as exportações em 'data/index.js'.");
            return [];
        }

        Object.entries(materialsMap).forEach(([key, data]) => {
            if (!data || ['positionsData', 'glossaryTerms', 'individualProducts', 'commandMap', 'menuItems'].includes(key)) return;
            
            if (key === 'productData') {
                Object.entries(data).forEach(([prodId, product]) => {
                    if (product && product.content) {
                        Object.entries(product.content).forEach(([contentKey, contentItem]) => {
                            addItem({ ...contentItem, id: `product_${prodId}_${contentKey}`, title: `${product.name} - ${contentItem.title}` });
                        });
                    }
                });
            } else if (Array.isArray(data)) {
                data.forEach(item => addItem(item));
            } else if (typeof data === 'object') {
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

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const lowercasedQuery = searchQuery.toLowerCase();
        return allMaterials.filter(item =>
            item.title.toLowerCase().includes(lowercasedQuery) ||
            (item.description && item.description.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, allMaterials]);
    
    // --- Handlers ---
    const handleMenuClick = (command) => {
        setSearchQuery('');
        if (command === 'chat') {
            setIsChatVisible(!isChatVisible);
        } else {
            setActiveCommand(command);
            if (command === 'produtos') setProductView('showcase');
        }
        setIsSidebarOpen(false);
    };
    
    const handleProductSelect = (productId) => {
        setSelectedProductId(productId);
        setProductView('detail');
    };

    const handleOpenShare = (material) => {
        setSelectedMaterial(material);
        setShareModalOpen(true);
    };

    const renderContent = () => {
        if (searchQuery.trim()) return <MaterialViewer title={`Resultados para "${searchQuery}"`}><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{searchResults.map((item, index) => <MaterialCard key={item.id || index} item={item} onShare={handleOpenShare} />)}</div></MaterialViewer>;
        if (activeCommand === 'produtos') {
            if (productView === 'showcase') return <ProductShowcase onProductSelect={handleProductSelect} />;
            if (productView === 'detail') return <ProductBrowser initialProductId={selectedProductId} onShare={handleOpenShare} onBack={() => setProductView('showcase')} />;
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
        return ActiveComponent || <MaterialViewer title={materialsMap.commandMap[activeCommand]?.title} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
             {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 p-4 shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out z-40 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 ${isSidebarCollapsed ? 'md:w-24' : 'md:w-80'}`}>
                
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-6 px-2`}>
                     <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} transition-all duration-300`}>
                       <Icons.LogoIcon />
                       <h1 className="text-xl font-bold text-slate-900 dark:text-white whitespace-nowrap">Plataforma</h1>
                    </div>
                     <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'w-auto opacity-100' : 'w-0 opacity-0'} transition-all duration-300`}>
                       <Icons.LogoIcon />
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><Icons.CloseIcon /></button>
                </div>

                <div className={`border-t border-b border-slate-200 dark:border-slate-700 py-3 mb-6 flex items-center ${isSidebarCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
                    <p className={`text-sm text-slate-500 dark:text-slate-400 truncate ${isSidebarCollapsed ? 'hidden' : ''}`}>
                        Bem-vindo, {user?.name}!
                    </p>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <button onClick={logout} title="Sair da Conta" className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                            <Icons.LogoutIcon />
                        </button>
                    </div>
                </div>

                <nav className="flex-grow space-y-4 overflow-y-auto">
                    {Object.entries(materialsMap.menuItems).map(([category, commands]) => (
                        <div key={category}>
                             <h3 className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-4 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                                {isSidebarCollapsed ? category.substring(0, 3) : category}
                            </h3>
                            <ul className="space-y-1">
                                {commands.map(command => (
                                     <li key={command} className="group relative">
                                        <button onClick={() => handleMenuClick(command)}
                                            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                                            <span className="w-6 h-6 flex-shrink-0">{materialsMap.commandMap[command].icon}</span>
                                            <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{materialsMap.commandMap[command].title}</span>
                                        </button>
                                        {isSidebarCollapsed && (
                                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                                                {materialsMap.commandMap[command].title}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        {isSidebarCollapsed ? <Icons.ChevronsRightIcon/> : <Icons.ChevronsLeftIcon />}
                        <span className={isSidebarCollapsed ? 'hidden' : ''}>Minimizar</span>
                    </button>
                </div>
            </aside>
            
            <main className={`h-screen flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-24' : 'md:ml-80'}`}>
                <header className="md:hidden flex justify-between items-center p-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b">
                    <h1 className="text-xl font-bold">{materialsMap.commandMap[activeCommand]?.title}</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2"><Icons.MenuIcon /></button>
                </header>
                <div className="flex-grow p-6 md:p-10 overflow-y-auto">
                    <div className="relative mb-6">
                        <input type="text" placeholder="Pesquisar em todos os materiais..." className="form-input w-full p-3 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Icons.SearchIcon />
                    </div>
                    {renderContent()}
                </div>
            </main>

            {isChatVisible && <GlobalChat isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />}
            {shareModalOpen && <ShareModal material={selectedMaterial} onClose={() => setShareModalOpen(false)} />}
        </div>
    );
};

export default PlatformLayout;

