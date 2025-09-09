// NOME DO ARQUIVO: components/materials/MaterialViewer.js
// NOVO: Componente genérico para envolver as secções de materiais.

import React from 'react';

export const MaterialViewer = ({ title, children }) => (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">{title}</h2>
        {children ? (
            <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-lg">
                {children}
            </div>
        ) : (
            <div className="bg-slate-100 dark:bg-indigo-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 min-h-[50vh] flex items-center justify-center">
                <p className="text-slate-500 text-xl text-center">O conteúdo para esta seção<br />estará disponível em breve.</p>
            </div>
        )}
    </div>
);

