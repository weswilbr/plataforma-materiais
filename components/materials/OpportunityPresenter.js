// NOME DO ARQUIVO: components/materials/OpportunityPresenter.js
// ATUALIZAÇÃO: Refatorado para usar a nova estrutura de partilha e importação de dados.

import React, { useState } from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';
import ShareModal from './ShareModal';

export const OpportunityPresenter = () => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleOpenShare = (material) => {
        setSelectedMaterial(material);
        setShareModalOpen(true);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Apresentação da Oportunidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(materialsMap.opportunityMaterials).map((item) => 
                    <MaterialCard 
                        key={item.title} 
                        item={item} 
                        onShare={handleOpenShare}
                    />
                )}
            </div>
            {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={() => setShareModalOpen(false)} />
            )}
        </div>
    );
};
