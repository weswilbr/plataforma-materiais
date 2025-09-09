// NOME DO ARQUIVO: components/materials/MaterialCard.js
// NOVO: Componente de UI para exibir um cartão de material individual, agora com botão de partilha.

import React from 'react';
import { ShareIcon, VideoIcon, PdfIcon, PptIcon, YoutubeIcon, LinkIcon, DownloadIcon, DefaultIcon } from '../icons';

export const MaterialCard = ({ item, onShare }) => {
    const getIcon = () => {
        const title = item.title.toLowerCase();
        if (title.includes('vídeo')) return <VideoIcon />;
        if (title.includes('pdf') || title.includes('guia') || title.includes('catálogo')) return <PdfIcon />;
        if (title.includes('powerpoint')) return <PptIcon />;
        if (title.includes('youtube')) return <YoutubeIcon />;
        if (item.type === 'link') return <LinkIcon />;
        if (item.type === 'file') return <DownloadIcon />;
        return <DefaultIcon />;
    };

    const isFile = item.type === 'file';

    return (
        <div className="group p-6 bg-white dark:bg-indigo-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div className="flex items-start space-x-4">
                <div className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0">{getIcon()}</div>
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end items-center gap-3">
                {isFile && onShare && (
                     <button onClick={() => onShare(item)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <ShareIcon />
                        <span>Partilhar</span>
                    </button>
                )}
                <a href={item.url} target={isFile ? "_self" : "_blank"} rel="noopener noreferrer" download={isFile}
                   className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    {isFile ? <><DownloadIcon /><span>Baixar</span></> : <><LinkIcon /><span>Abrir Link</span></>}
                </a>
            </div>
        </div>
    );
};

