// NOME DO ARQUIVO: components/materials/TransferFactorPresenter.js
// ATUALIZAÇÃO: Componente reescrito para usar a nova arquitetura de materiais,
// integrando o MaterialViewer, MaterialCard e a funcionalidade de partilha.

import React, { useState } from 'react';
import { MaterialViewer } from './MaterialViewer';
import { MaterialCard } from './MaterialCard';
import { ShareModal } from './ShareModal';
import { materialsMap } from '../../data';

export const TransferFactorPresenter = () => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleOpenShare = (material) => {
        setSelectedMaterial(material);
        setShareModalOpen(true);
    };

    const handleCloseShare = () => {
        setShareModalOpen(false);
        setSelectedMaterial(null);
    };

    return (
        <>
            <MaterialViewer title="Fatores de Transferência">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(materialsMap.transferFactorMaterials).map((item) => (
                        <MaterialCard key={item.title} item={item} onShare={handleOpenShare} />
                    ))}
                </div>
            </MaterialViewer>
            
            {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={handleCloseShare} />
            )}
        </>
    );
};
