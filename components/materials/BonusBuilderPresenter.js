// NOME DO ARQUIVO: components/materials/BonusBuilderPresenter.js
// NOVO: Componente dedicado para a secção "Bônus Construtor".

import React from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';

export const BonusBuilderPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Bônus Construtor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(materialsMap.bonusBuilderMaterials).map((item) => <MaterialCard key={item.title} item={item} />)}
        </div>
    </div>
);
