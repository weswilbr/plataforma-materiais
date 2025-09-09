// NOME DO ARQUIVO: components/materials/ArtsPresenter.js
// NOVO: Componente dedicado para a secção "Criação de Artes".

import React, { useState } from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';

export const ArtsPresenter = () => {
    const [view, setView] = useState('main');

    if (view === 'criativos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar ao Menu de Artes</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Modelos de Criativos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(materialsMap.artsMaterials.criativos).map((item) => 
                        <MaterialCard key={item.title} item={item} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Criação de Artes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(materialsMap.artsMaterials.artes_fixas).map((item) => 
                    <MaterialCard key={item.title} item={item} />
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
