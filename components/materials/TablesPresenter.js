// NOME DO ARQUIVO: components/materials/TablesPresenter.js
// NOVO: Componente dedicado para a secção "Tabelas".

import React, { useState } from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';

export const TablesPresenter = () => {
    const [view, setView] = useState('main');

    const SubMenuView = ({ title, onBack, items }) => (
        <div>
            <button onClick={onBack} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(items).map((item) => <MaterialCard key={item.title} item={item} />)}
            </div>
        </div>
    );

    switch(view) {
        case 'precos_produtos':
            return <SubMenuView title="Preços de Produtos" onBack={() => setView('precos')} items={materialsMap.tablesMaterials.precos_produtos} />;
        case 'precos_kits':
            return <SubMenuView title="Preços de Kits" onBack={() => setView('precos')} items={materialsMap.tablesMaterials.precos_kits} />;
        case 'precos':
            return (
                <div>
                    <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                    <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Tabela de Preços</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => setView('precos_produtos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📦 Produtos</h3></button>
                        <button onClick={() => setView('precos_kits')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">🎁 Kits</h3></button>
                    </div>
                </div>
            );
        default:
            return (
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Menu de Tabelas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => setView('precos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform">
                            <h3 className="text-2xl font-bold dark:text-white">📊 Tabela de Preços</h3>
                        </button>
                        <MaterialCard item={materialsMap.tablesMaterials.pontos} />
                        <MaterialCard item={materialsMap.tablesMaterials.resgate_fidelidade} />
                    </div>
                </div>
            );
    }
};
