// NOME DO ARQUIVO: components/PlatformLayout.js
// ATUALIZAÇÃO: A barra de menu lateral foi aprimorada para ser retrátil,
// permitindo ao utilizador minimizar o menu para focar no conteúdo principal.

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import InviteGenerator from './InviteGenerator';
import WelcomeScreen from './WelcomeScreen';
import GlobalChat from './GlobalChat';
import ProspectsList from './ProspectsList';
import * as Materials from './materials';
import { materialsMap } from '../data';
import * as Icons from './icons';
import ThemeSwitcher from './ThemeSwitcher';

// --- Sub-componente: Item do Menu Lateral ---
const SidebarItem = ({ command, activeCommand, onMenuClick, isCollapsed }) => {
    const { title, icon } = materialsMap.commandMap[command];
    const isActive = activeCommand === command;

    return (
        <li className="relative">
            <button 
                onClick={() => onMenuClick(command)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
            >
                <span className="w-6 h-6 flex-shrink-0">{icon}</span>
                <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{title}</span>
            </button>
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    {title}
                </div>
            )}
        </li>
    );
};


const PlatformLayout = () => {
    const [activeCommand, setActiveCommand] = useState('inicio');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [productView, setProductView] = useState('showcase');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

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
        if (searchQuery) return <Materials.SearchResults results={searchResults} onProductClick={handleProductSelect} onShare={handleOpenShare} />;
        if (activeCommand === 'produtos') {
            if (productView === 'showcase') return <Materials.ProductShowcase onProductSelect={handleProductSelect} />;
            if (productView === 'detail') return <Materials.ProductBrowser initialProductId={selectedProductId} onShare={handleOpenShare} onBack={() => setProductView('showcase')} />;
        }
        const componentMap = {
            'inicio': <WelcomeScreen />, 'convite': <InviteGenerator />, 'prospects': <ProspectsList />,
            'apresentacao': <Materials.OpportunityPresenter onShare={handleOpenShare} />,
            'bonusconstrutor': <Materials.BonusBuilderPresenter onShare={handleOpenShare} />,
            'fabrica4life': <Materials.FactoryPresenter onShare={handleOpenShare} />,
            'fatorestransferencia': <Materials.TransferFactorPresenter onShare={handleOpenShare} />,
            'fidelidade': <Materials.LoyaltyPresenter onShare={handleOpenShare} />,
            'folheteria': <Materials.BrochurePresenter onShare={handleOpenShare} />,
            'artes': <Materials.ArtsPresenter onShare={handleOpenShare} />,
            'tabelas': <Materials.TablesPresenter />, 'glossario': <Materials.GlossaryPresenter />, 'ranking': <Materials.RankingPresenter />,
            'canais': <Materials.ChannelsPresenter />,
        };
        return componentMap[activeCommand] || <Materials.MaterialViewer title={materialsMap.commandMap[activeCommand]?.title} />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 p-4 shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out z-40 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 ${isSidebarCollapsed ? 'md:w-24' : 'md:w-80'}`}>
                
                {/* Cabeçalho do Sidebar */}
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

                {/* Informações do Utilizador */}
                <div className={`border-t border-b border-slate-200 dark:border-slate-700 py-3 mb-6 flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-2' : ''}`}>
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

                {/* Navegação */}
                <nav className="flex-grow space-y-4 overflow-y-auto">
                    {Object.entries(materialsMap.menuItems).map(([category, commands]) => (
                        <div key={category}>
                             <h3 className={`text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-4 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                                {isSidebarCollapsed ? category.substring(0, 3) : category}
                            </h3>
                            <ul className="space-y-1">
                                {commands.map(command => (
                                    <div key={command} className="group">
                                        <SidebarItem 
                                            command={command}
                                            activeCommand={activeCommand}
                                            onMenuClick={handleMenuClick}
                                            isCollapsed={isSidebarCollapsed}
                                        />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Botão de Minimizar */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        {isSidebarCollapsed ? <Icons.ChevronsRightIcon/> : <Icons.ChevronsLeftIcon />}
                        <span className={isSidebarCollapsed ? 'hidden' : ''}>Minimizar Menu</span>
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
            {shareModalOpen && <Materials.ShareModal material={selectedMaterial} onClose={() => setShareModalOpen(false)} />}
        </div>
    );
};

export default PlatformLayout;

