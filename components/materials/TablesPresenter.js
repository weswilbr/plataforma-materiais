// NOME DO ARQUIVO: components/materials/TablesPresenter.js
// APRIMORAMENTO: Componente totalmente redesenhado para uma experiência imersiva.
// A navegação por menus foi substituída por um sistema de abas visual.
// Cada tabela é agora exibida como uma imagem, com opções diretas para download e partilha.

import React, { useState } from 'react';
import Image from 'next/image';
import { materialsMap } from '../../data';
import * as Icons from '../icons';

// --- Sub-componente: Cartão de Tabela Individual ---
const TableCard = ({ title, imageUrl, onShare }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
        <div className="w-full aspect-[4/5] relative mb-4 rounded-md overflow-hidden border dark:border-slate-700">
            <Image 
                src={imageUrl} 
                alt={`Tabela de ${title}`} 
                layout="fill" 
                objectFit="contain" 
                className="bg-slate-50 dark:bg-slate-900"
            />
        </div>
        <div className="flex items-center gap-4">
            <a 
                href={imageUrl} 
                download={`Tabela-${title.replace(/ /g, '-')}.png`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
                <Icons.DownloadIcon />
                <span>Baixar</span>
            </a>
            <button 
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                <Icons.WhatsAppIcon />
                <span>Partilhar</span>
            </button>
        </div>
    </div>
);


export const TablesPresenter = () => {
    const [activeTab, setActiveTab] = useState('precos');
    const { tablesMaterials } = materialsMap;

    const handleShare = (title, imageUrl) => {
        const message = encodeURIComponent(`Olá! Segue a tabela de ${title} para consulta.`);
        const fullUrl = `${window.location.origin}${imageUrl}`;
        // Idealmente, a partilha da imagem requer um URL público ou a conversão para base64.
        // Por simplicidade, partilharemos uma mensagem com o link para a imagem.
        const textMessage = `Olá! Confira a tabela de ${title} aqui: ${fullUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
    };

    return (
        <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Tabelas de Referência</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">Consulte, baixe e partilhe as tabelas essenciais para o seu negócio.</p>
            
            {/* Navegação por Abas */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
                    <button onClick={() => setActiveTab('precos')} className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'precos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Preços
                    </button>
                    <button onClick={() => setActiveTab('pontos')} className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'pontos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Pontuação
                    </button>
                    <button onClick={() => setActiveTab('fidelidade')} className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'fidelidade' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                        Programa de Fidelidade
                    </button>
                </nav>
            </div>

            {/* Conteúdo das Abas */}
            <div>
                {activeTab === 'precos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                        <TableCard title="Preço Afiliado" imageUrl={tablesMaterials.precos_produtos.afiliado.url} onShare={() => handleShare('Preços de Afiliado', tablesMaterials.precos_produtos.afiliado.url)} />
                        <TableCard title="Preço Loja" imageUrl={tablesMaterials.precos_produtos.loja.url} onShare={() => handleShare('Preços de Loja', tablesMaterials.precos_produtos.loja.url)} />
                        <TableCard title="Preço Consumidor" imageUrl={tablesMaterials.precos_produtos.consumidor.url} onShare={() => handleShare('Preços de Consumidor', tablesMaterials.precos_produtos.consumidor.url)} />
                    </div>
                )}
                {activeTab === 'pontos' && (
                     <div className="max-w-md mx-auto animate-fadeIn">
                        <TableCard title="Pontuação de Produtos" imageUrl={tablesMaterials.pontos.url} onShare={() => handleShare('Pontuação de Produtos', tablesMaterials.pontos.url)} />
                    </div>
                )}
                {activeTab === 'fidelidade' && (
                     <div className="max-w-md mx-auto animate-fadeIn">
                        <TableCard title="Resgate do Programa de Fidelidade" imageUrl={tablesMaterials.resgate_fidelidade.url} onShare={() => handleShare('Resgate do Programa de Fidelidade', tablesMaterials.resgate_fidelidade.url)} />
                    </div>
                )}
            </div>
        </div>
    );
};
