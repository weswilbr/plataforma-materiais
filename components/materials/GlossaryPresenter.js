// NOME DO ARQUIVO: components/materials/GlossaryPresenter.js
// NOVO: Componente dedicado para a secção "Glossário".

import React, { useState } from 'react';
import { materialsMap } from '../../data';

export const GlossaryPresenter = () => {
    const [selectedTermKey, setSelectedTermKey] = useState(null);
    const terms = materialsMap.glossaryTerms;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Glossário de Termos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(terms).map(([key, term]) => (
                    <button 
                        key={key} 
                        onClick={() => setSelectedTermKey(selectedTermKey === key ? null : key)} 
                        className="p-4 bg-white dark:bg-indigo-800 rounded-lg shadow-md text-left hover:shadow-lg hover:bg-slate-50 dark:hover:bg-indigo-700 transition"
                    >
                        <h3 className="font-semibold text-md dark:text-white">{term.emoji} {term.title}</h3>
                    </button>
                ))}
            </div>
            {selectedTermKey && (
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                        {terms[selectedTermKey].emoji} {terms[selectedTermKey].title}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                        {terms[selectedTermKey].definition}
                    </p>
                </div>
            )}
        </div>
    );
};
