// NOME DO ARQUIVO: components/materials/ProductBrowser.js
// REESCRITA: O componente foi simplificado para focar exclusivamente na exibição
// dos materiais de um produto específico. A funcionalidade de geração de "pitch" com IA
// foi removida para uma interface mais limpa e direta.

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';
import ShareModal from './ShareModal';

export const ProductBrowser = ({ initialProductId, onBack }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Efeito para carregar os dados do produto quando o ID é recebido
    useEffect(() => {
        if (initialProductId) {
            const product = materialsMap.productData[initialProductId];
            if (product) {
                setSelectedProduct({ id: initialProductId, ...product });
            } else {
                // Caso o ID do produto seja inválido, volta para a lista
                onBack();
            }
        } else {
            setSelectedProduct(null);
        }
    }, [initialProductId, onBack]);

    // Handler para abrir o modal de partilha
    const handleOpenShare = (material) => {
        // Adiciona o nome do produto ao material para usar na mensagem de partilha
        setSelectedMaterial({ ...material, productName: selectedProduct.name });
        setShareModalOpen(true);
    };

    // Handler para fechar o modal de partilha
    const handleCloseShare = () => {
        setShareModalOpen(false);
        setSelectedMaterial(null);
    };

    // Se nenhum produto estiver selecionado (ou a carregar), mostra uma mensagem
    if (!selectedProduct) {
        return (
            <div className="text-center p-10">
                <p className="text-slate-500">A carregar produto...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Cabeçalho da página do produto */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <Image 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name} 
                            layout="fill"
                            objectFit="contain"
                            className="bg-slate-100 dark:bg-indigo-800 rounded-full p-2"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{selectedProduct.name}</h2>
                </div>
                <button 
                    onClick={onBack} 
                    className="w-full sm:w-auto bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition flex-shrink-0"
                >
                    &larr; Voltar para Todos os Produtos
                </button>
            </div>

            {/* Grelha de materiais do produto */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(selectedProduct.content).map(item => (
                    <MaterialCard 
                        key={item.title} 
                        item={item} 
                        onShare={handleOpenShare} // Passa a função de partilha para cada cartão
                    />
                ))}
            </div>

            {/* Modal de partilha */}
            {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={handleCloseShare} />
            )}
        </div>
    );
};