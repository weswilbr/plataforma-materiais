// NOME DO ARQUIVO: components/materials/LoyaltyPresenter.js
// NOVO: Componente dedicado para a secção "Programa de Fidelidade".

import React from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';

export const LoyaltyPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Programa de Fidelidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(materialsMap.loyaltyMaterials).map((item) => <MaterialCard key={item.title} item={item} />)}
        </div>
    </div>
);
