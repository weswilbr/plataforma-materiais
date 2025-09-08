// NOME DO ARQUIVO: components/PlatformLayout.js
// Versão aprimorada com menu lateral redesenhado com ícones para um visual mais sofisticado.
// MODIFICAÇÃO: Botão de Sair movido para o cabeçalho do menu para acesso rápido.

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

// --- Ícones do Menu ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M8 21v-9a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v9"/></svg>;
const PresentationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M7 21h10"/><path d="M12 16v5"/></svg>;
const NetworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="19" cy="12" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="12" cy="19" r="3"/><path d="m12 8-3.5 1.5"/><path d="m12 16 3.5 1.5"/><path d="m15.5 13.5-3.5 1.5"/><path d="m8.5 10.5 3.5 1.5"/><path d="m5 12 7 4 7-4"/><path d="m12 8-7-4 7 4 7-4-7 4Z"/></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 5a4.8 8 0 0 1 4.5 3 2.5 2.5 0 0 1 0 5"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z"/><path d="M12 14.1a10 10 0 0 1-7.5-3.8c0-1 .5-4.3 7.5-4.3s7.5 3.3 7.5 4.3a10 10 0 0 1-7.5 3.8z"/><path d="M12 21a10 10 0 0 0 7.5-3.8c0-1-.5-4.3-7.5-4.3s-7.5 3.3-7.5 4.3A10 10 0 0 0 12 21z"/></svg>;
const DnaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.5A4.5 4.5 0 0 1 8.5 10H10a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1.5A4.5 4.5 0 0 1 4 14.5z"/><path d="M20 9.5A4.5 4.5 0 0 0 15.5 5H14a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h1.5A4.5 4.5 0 0 0 20 9.5z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const FactoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7l-2 5H4L2 7"/></svg>;
const NewspaperIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"/><path d="M16 2v20"/><path d="M8 7h4"/><path d="M8 12h4"/><path d="M8 17h4"/></svg>;
const PaletteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.5-2.449 5.5-5.5S17.551 2 14.5 2h-2.5Z"/></svg>;
const ChannelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;


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
        'inicio': { title: 'Início', icon: <HomeIcon /> },
        'chat': { title: 'Chat Global', icon: <ChatIcon /> },
        'convite': { title: 'Gerador de Convites', icon: <SparklesIcon /> },
        'ranking': { title: 'Ranking', icon: <TrophyIcon /> },
        'apresentacao': { title: 'Apresentação', icon: <PresentationIcon /> },
        'marketingrede': { title: 'Marketing de Rede', icon: <NetworkIcon /> },
        'recompensas2024': { title: 'Recompensas', icon: <GiftIcon /> },
        'bonusconstrutor': { title: 'Bônus Construtor', icon: <BuildingIcon /> },
        'treinamento': { title: 'Treinamentos', icon: <BookOpenIcon /> },
        'produtos': { title: 'Produtos', icon: <PackageIcon /> },
        'fatorestransferencia': { title: 'Fatores de Transferência', icon: <DnaIcon /> },
        'profissionais': { title: 'Profissionais de Saúde', icon: <UsersIcon /> },
        'fabrica4life': { title: 'Fábrica 4LIFE', icon: <FactoryIcon /> },
        'fidelidade': { title: 'Programa de Fidelidade', icon: <StarIcon /> },
        'glossario': { title: 'Glossário', icon: <HelpCircleIcon /> },
        'tabelas': { title: 'Tabelas', icon: <TableIcon /> },
        'loja': { title: 'Loja Personalizada', icon: <StoreIcon /> },
        'folheteria': { title: 'Folheteria', icon: <NewspaperIcon /> },
        'artes': { title: 'Criação de Artes', icon: <PaletteIcon /> },
        'canais': { title: 'Canais', icon: <ChannelsIcon /> },
        'admin_panel': { title: 'Painel de Controle', icon: <AdminIcon /> },
        'manage_users': { title: 'Gerenciar Usuários', icon: <UsersIcon /> },
        'view_stats': { title: 'Ver Estatísticas', icon: <TrophyIcon /> }
    };
    
    const getMenuItems = (role) => {
        const baseMenu = {
            "Geral": ['inicio', 'chat'],
            "Ferramentas IA": ['convite'],
            "Negócio": ['ranking', 'apresentacao', 'marketingrede', 'recompensas2024', 'bonusconstrutor', 'treinamento'],
            "Recursos": ['produtos', 'fatorestransferencia', 'profissionais', 'fabrica4life', 'fidelidade', 'glossario', 'tabelas',  'loja'],
            "Marketing": ['folheteria', 'artes', 'canais'],
        };
        if (role === 'admin') {
            baseMenu["Administração"] = ['admin_panel', 'manage_users', 'view_stats'];
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
            
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 w-80 p-6 h-screen shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Top Section: Header + User Info + Logout */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Plataforma</h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" aria-label="Fechar menu">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Bem-vindo, {user?.name}!</p>
                        <button onClick={handleLogout} disabled={isLoggingOut} title="Sair da Conta" className="p-2 rounded-lg transition duration-200 ease-in-out text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-70">
                           {isLoggingOut ? <div className="loader h-5 w-5"></div> : <LogoutIcon />}
                        </button>
                    </div>
                </div>
                
                {/* Middle Section: Navigation (Scrollable) */}
                <nav className="flex-grow space-y-6 overflow-y-auto -mr-3 pr-3">
                    {Object.entries(menuItems).map(([category, commands]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-4">{category}</h3>
                            <ul className="space-y-1">
                                {commands.map(command => {
                                    if (command === 'produtos') {
                                        return (
                                            <li key={command}>
                                                <details className="group/submenu">
                                                    <summary className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium flex items-center justify-between gap-4 cursor-pointer list-none ${activeCommand === command ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <span className="w-6 h-6">{commandMap[command].icon}</span>
                                                            <span>{commandMap[command].title}</span>
                                                        </div>
                                                        <svg className="w-4 h-4 transform group-open/submenu:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </summary>
                                                    <ul className="space-y-1 pl-6 mt-2 border-l-2 border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                                                        {materialsMap.individualProducts.map(product => (
                                                            <li key={product.id}>
                                                                <button onClick={() => handleProductClick(product.id)} className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 text-sm flex items-center gap-3 ${selectedProductId === product.id ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'} hover:bg-slate-100 dark:hover:bg-slate-700`}>
                                                                    <Image src={product.image} alt={product.name} width={24} height={24} className="rounded-full bg-slate-200 object-contain" />
                                                                    <span>{product.name}</span>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            </li>
                                        );
                                    }
                                    return (
                                        <li key={command}>
                                            <button onClick={() => handleMenuClick(command)} className={`w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ease-in-out text-md font-medium flex items-center gap-4 ${activeCommand === command ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                                <span className="w-6 h-6">{commandMap[command].icon}</span>
                                                <span>{commandMap[command].title}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
                
                {/* Bottom Section: Theme Switcher */}
                <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <ThemeSwitcher />
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
                     <div className="relative mb-6">
                         <input
                             type="text"
                             placeholder="Pesquisar materiais (em breve)..."
                             className="w-full p-3 pl-10 bg-slate-100 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                             disabled
                         />
                         <SearchIcon />
                     </div>

                     {renderContent()}
                 </div>
            </main>

            {isChatVisible && (
                <GlobalChat isVisible={isChatVisible} onClose={() => setIsChatVisible(false)} />
            )}
        </div>
    );
};

export default PlatformLayout;

