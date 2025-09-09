// NOME DO ARQUIVO: components/materials/RankingPresenter.js
// NOVO: Componente dedicado para a secção "Ranking".

import React from 'react';
import { materialsMap } from '../../data';

export const RankingPresenter = () => {
    const formatCurrency = (value) => value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : 'N/A';
    const formatValue = (value, suffix = '') => value ? `${value.toLocaleString('pt-BR')}${suffix}` : 'N/A';

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
                                <td className="px-6 py-4">{details.viagens_incentivo ? '✅' : '❌'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
