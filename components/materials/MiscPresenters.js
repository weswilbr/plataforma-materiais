// NOME DO ARQUIVO: components/materials/MiscPresenters.js
// DESCRIÇÃO: Agrupa os componentes de apresentação de materiais mais simples e com menos lógica interna.

import React, { useState } from 'react';
import { materialsMap } from '../../data/materials';
import { MaterialCard } from './MaterialUI';

// ArtsPresenter
export const ArtsPresenter = () => {
    const [view, setView] = useState('main');

    if (view === 'criativos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar ao Menu de Artes</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Modelos de Criativos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(materialsMap.artsMaterials.criativos).map(([key, item]) => 
                        <MaterialCard key={item.title} item={item} filePath={`artsMaterials.criativos.${key}`} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Criação de Artes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(materialsMap.artsMaterials.artes_fixas).map(([key, item]) => 
                    <MaterialCard key={item.title} item={item} filePath={`artsMaterials.artes_fixas.${key}`} />
                )}
                <button onClick={() => setView('criativos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform flex items-start space-x-4">
                    <span className="text-4xl">💡</span>
                    <div>
                        <h3 className="text-2xl font-bold dark:text-white">Criativos (Modelos)</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Veja modelos de imagens, carrosséis e vídeos.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

// BrochurePresenter
export const BrochurePresenter = () => {
    const [view, setView] = useState('main');
    if (view === 'panfletos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Panfletos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.brochureMaterials.panfletos).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`brochureMaterials.panfletos.${key}`} />)}
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Folheteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('panfletos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📰 Ver Panfletos</h3></button>
                <MaterialCard item={materialsMap.brochureMaterials.catalogo} filePath="brochureMaterials.catalogo" />
                <MaterialCard item={materialsMap.brochureMaterials.enquete} filePath="brochureMaterials.enquete" />
            </div>
        </div>
    );
};

// LoyaltyPresenter
export const LoyaltyPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Programa de Fidelidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.loyaltyMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`loyaltyMaterials.${key}`} />)}
        </div>
    </div>
);

// TransferFactorPresenter
export const TransferFactorPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Fatores de Transferência</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.transferFactorMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`transferFactorMaterials.${key}`} />)}
        </div>
    </div>
);

// FactoryPresenter
export const FactoryPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Vídeos da Fábrica 4Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.factoryMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`factoryMaterials.${key}`} />)}
        </div>
    </div>
);

// BonusBuilderPresenter
export const BonusBuilderPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Bônus Construtor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(materialsMap.bonusBuilderMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`bonusBuilderMaterials.${key}`} />)}</div>
    </div>
);

// TablesPresenter
export const TablesPresenter = () => {
    const [view, setView] = useState('main');
    if (view === 'precos_produtos') {
         return (
            <div>
                <button onClick={() => setView('precos')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Preços de Produtos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.tablesMaterials.precos_produtos).map(([key, item]) => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title.split(' ')[1]}.`}} filePath={`tablesMaterials.precos_produtos.${key}`} />)}
                </div>
            </div>
        )
    }
    if (view === 'precos_kits') {
        return (
            <div>
                <button onClick={() => setView('precos')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Preços de Kits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.tablesMaterials.precos_kits).map(([key, item]) => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title}.`}} filePath={`tablesMaterials.precos_kits.${key}`} />)}
                </div>
            </div>
        )
    }
    if (view === 'precos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Tabela de Preços</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setView('precos_produtos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📦 Produtos</h3></button>
                    <button onClick={() => setView('precos_kits')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">🎁 Kits</h3></button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Menu de Tabelas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('precos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📊 Tabela de Preços</h3></button>
                <MaterialCard item={{...materialsMap.tablesMaterials.pontos, description: 'Consulte a tabela de pontos dos produtos.'}} filePath="tablesMaterials.pontos" />
                <MaterialCard item={{...materialsMap.tablesMaterials.resgate_fidelidade, description: 'Veja a tabela para resgate de pontos.'}} filePath="tablesMaterials.resgate_fidelidade" />
            </div>
        </div>
    );
};

// GlossaryPresenter
export const GlossaryPresenter = () => {
    const [selectedTerm, setSelectedTerm] = useState(null);
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Glossário de Termos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(materialsMap.glossaryTerms).map(([key, term]) => (
                    <button key={key} onClick={() => setSelectedTerm(selectedTerm === key ? null : key)} className="p-4 bg-white dark:bg-indigo-800 rounded-lg shadow-md text-left hover:shadow-lg hover:bg-slate-50 dark:hover:bg-indigo-700 transition">
                        <h3 className="font-semibold text-md dark:text-white">{term.emoji} {term.title}</h3>
                    </button>
                ))}
            </div>
            {selectedTerm && (
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{materialsMap.glossaryTerms[selectedTerm].emoji} {materialsMap.glossaryTerms[selectedTerm].title}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{materialsMap.glossaryTerms[selectedTerm].definition}</p>
                </div>
            )}
            <div className="mt-8">
                 <MaterialCard item={{type: 'file', title: 'Baixar Glossário Completo', description: 'Tenha todos os termos em um único arquivo PDF.', url: '/path/to/glossario.pdf'}} filePath="glossaryTerms.download" />
            </div>
        </div>
    );
};

// RankingPresenter
export const RankingPresenter = () => {
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };
    const formatValue = (value, suffix = '') => {
        if (value === null || value === undefined) return 'N/A';
        return `${value.toLocaleString('pt-BR')}${suffix}`;
    };
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Ranking de Posições</h2>
            <div className="overflow-x-auto bg-white dark:bg-indigo-900 rounded-lg shadow-lg">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-indigo-800 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Posição</th>
                            <th scope="col" className="px-6 py-3">PV Mensal</th>
                            <th scope="col" className="px-6 py-3">LP 3 Níveis</th>
                            <th scope="col" className="px-6 py-3">Ganhos (Média)</th>
                            <th scope="col" className="px-6 py-3">Viagens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(materialsMap.positionsData).map(([name, details]) => (
                            <tr key={name} className="bg-white dark:bg-indigo-900 border-b dark:border-indigo-800 hover:bg-slate-50 dark:hover:bg-indigo-800">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{details.emoji} {name}</th>
                                <td className="px-6 py-4">{formatValue(details.pv_mensal, ' PV')}</td>
                                <td className="px-6 py-4">{formatValue(details.lp_nos_3_niveis, ' LP')}</td>
                                <td className="px-6 py-4">{formatCurrency(details.media_ganho)}</td>
                                <td className="px-6 py-4">{details.viagens_incentivo ? '✅ Sim' : '❌ Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ChannelsPresenter
export const ChannelsPresenter = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Canais Oficiais</h2>
            <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'youtube' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('youtube')} type="button">📺 YouTube</button></li>
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'telegram' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('telegram')} type="button">📲 Telegram</button></li>
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'whatsapp' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('whatsapp')} type="button">💬 WhatsApp</button></li>
                </ul>
            </div>
            <div>
                <div className={`${activeTab === 'youtube' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.youtube.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'telegram' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.telegram.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'whatsapp' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.whatsapp.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
            </div>
        </div>
    );
};
