// NOME DO ARQUIVO: components/materials/OpportunityPresenter.js
// DESCRIÇÃO: Componente que exibe os materiais da "Apresentação da Oportunidade".

import React, { useState } from 'react';
import { materialsMap } from '../../data/materials';
import { MaterialCard } from './MaterialUI';
import ShareModal from './ShareModal';

export const OpportunityPresenter = () => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleOpenShare = (material, filePath) => {
        setSelectedMaterial({ ...material, filePath });
        setShareModalOpen(true);
    };

    const handleCloseShare = () => {
        setShareModalOpen(false);
        setSelectedMaterial(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Apresentação da Oportunidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(materialsMap.opportunityMaterials).map(([key, item]) => 
                    <MaterialCard 
                        key={item.title} 
                        item={item} 
                        filePath={`opportunityMaterials.${key}`} 
                        onShare={handleOpenShare}
                    />
                )}
            </div>
            {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={handleCloseShare} />
            )}
        </div>
    );
};
