// NOME DO ARQUIVO: components/materials/MaterialUI.js
// DESCRIÇÃO: Componentes de UI reutilizáveis para exibir materiais, como os cartões e o visualizador.

import React from 'react';
import Image from 'next/image';

// --- Ícones ---
export const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>;
export const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>;
export const PdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M4 12V4a2 2 0 0 1 2-2h8l4 4v4"></path><path d="M4 20h1.5a1.5 1.5 0 0 0 0-3H4v3Z"></path><path d="M14.5 20h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1v5Z"></path><path d="M10 15h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"></path></svg>;
export const PptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path><path d="M4 15h16"></path><path d="M8 11h.01"></path><path d="M12 11h.01"></path><path d="M16 11h.01"></path><path d="M8 7h.01"></path><path d="M12 7h.01"></path><path d="M16 7h.01"></path></svg>;
export const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v-6l5 3-5 3Z"></path><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7 4 12 4s9.5 2 9.5 3a24.12 24.12 0 0 1 0 10c0 1-4.5 3-9.5 3s-9.5-2-9.5-3Z"></path></svg>;
export const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>;
export const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
export const DefaultIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>;
export const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.42.2.46.2a.38.38 0 0 1 .18.42c-.06.26-.45.9-.56 1.05c-.1.15-.26.2-.4.13c-.15-.06-.6-.26-1.12-.5c-.54-.25-1.04-.58-1.48-.98c-.44-.4-.8-1-.9-1.16c-.1-.18-.04-.28.04-.38c.08-.08.18-.2.25-.26c.08-.08.13-.13.18-.2a.5.5 0 0 0 .04-.42c-.05-.13-.45-1.08-.6-1.48c-.16-.4-.3-.34-.42-.34c-.1-.02-1 .08-1.13.08c-.13 0-.3.03-.45.2c-.15.15-.58.55-.58 1.35s.6 1.58.68 1.7c.08.1.58 1.25 2 2.3c1.4 1.05 2.15 1.25 2.53 1.25c.38 0 .6-.08.7-.28c.1-.2.45-.85.5-1.1c.06-.25.04-.48-.03-.55c-.08-.08-.18-.13-.38-.23zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8z" /></svg>;


export const MaterialViewer = ({ title, children }) => (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">{title}</h2>
        {children ? (
            <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-lg">
                {children}
            </div>
        ) : (
            <div className="bg-slate-100 dark:bg-indigo-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 min-h-[50vh] flex items-center justify-center"><p className="text-slate-500 text-xl text-center">O conteúdo e os materiais para esta seção<br />estarão disponíveis em breve.</p></div>
        )}
    </div>
);

export const MaterialCard = ({ item, onShare }) => {
    const getIcon = (type, title) => {
        if (title.toLowerCase().includes('vídeo')) return <VideoIcon />;
        if (title.toLowerCase().includes('pdf') || title.toLowerCase().includes('guia')) return <PdfIcon />;
        if (title.toLowerCase().includes('powerpoint')) return <PptIcon />;
        if (title.toLowerCase().includes('youtube')) return <YoutubeIcon />;
        if (type === 'link') return <LinkIcon />;
        if (type === 'file') return <DownloadIcon />;
        return <DefaultIcon />;
    };

    const url = item.url;
    const target = item.type === 'link' ? '_blank' : '_self';
    const downloadAttribute = item.type === 'file' ? { download: true } : {};

    return (
        <div className="group p-6 bg-white dark:bg-indigo-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <a href={url} target={target} rel="noopener noreferrer" {...downloadAttribute} className="flex items-start space-x-4">
                <div className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0">
                    {getIcon(item.type, item.title)}
                </div>
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
            </a>
            {onShare && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <button onClick={() => onShare(item)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <ShareIcon />
                        Partilhar
                    </button>
                </div>
            )}
        </div>
    );
};

