// NOME DO ARQUIVO: components/materials/BrochurePresenter.js
// NOVO: Componente dedicado para a secção "Folheteria".

import React, { useState } from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';

export const BrochurePresenter = () => {
    const [view, setView] = useState('main');

    if (view === 'panfletos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Panfletos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(materialsMap.brochureMaterials.panfletos).map((item) => <MaterialCard key={item.title} item={item} />)}
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Folheteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('panfletos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform">
                    <h3 className="text-2xl font-bold dark:text-white">📰 Ver Panfletos</h3>
                </button>
                <MaterialCard item={materialsMap.brochureMaterials.catalogo} />
                <MaterialCard item={materialsMap.brochureMaterials.enquete} />
            </div>
        </div>
    );
};
