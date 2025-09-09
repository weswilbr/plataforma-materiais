// NOME DO ARQUIVO: components/materials/ProductBrowser.js
// ATUALIZAÇÃO: Refatorado para usar a nova estrutura de dados e componentes, e integrar a partilha.

import React, { useState, useEffect } from 'react';
import { materialsMap } from '../../data';
import { MaterialCard } from './MaterialCard';
import ShareModal from './ShareModal';

export const ProductBrowser = ({ initialProductId, onBack }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedPitches, setGeneratedPitches] = useState({});
    const [isPitchLoading, setIsPitchLoading] = useState(null);
    const [pitchCopyButtonText, setPitchCopyButtonText] = useState({});
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        if (initialProductId) {
            const product = materialsMap.productData[initialProductId];
            setSelectedProduct({ id: initialProductId, ...product });
        } else {
            setSelectedProduct(null);
        }
    }, [initialProductId]);

    const handleOpenShare = (material) => {
        setSelectedMaterial({ ...material, productName: selectedProduct.name });
        setShareModalOpen(true);
    };

    const callApi = async (prompt) => { try { const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), }); if (!response.ok) throw new Error('Falha na resposta da API.'); const data = await response.json(); return data.text; } catch (error) { console.error('Erro ao chamar a API:', error); return 'Ocorreu um erro ao processar o seu pedido.'; } };
    const handleGeneratePitchClick = async (productId, productName) => { setIsPitchLoading(productId); const prompt = `Gere 3 opções distintas de copy de anúncio para tráfego pago, em português do Brasil, para o produto "${productName}". Cada opção deve ser curta (2-3 frases), persuasiva, usar emojis ✨ e ter uma chamada para ação clara como "Saiba Mais". Separe as 3 opções EXATAMENTE com '|||' e não adicione nenhum texto introdutório, numeração ou títulos.`; const result = await callApi(prompt); const resultsArray = result.split('|||').map(s => s.trim()).filter(Boolean); setGeneratedPitches(prev => ({ ...prev, [productId]: resultsArray })); setIsPitchLoading(null); };
    const handleCopyPitch = (textToCopy, productId, index) => { navigator.clipboard.writeText(textToCopy); const key = `${productId}-${index}`; setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiado!' })); setTimeout(() => setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiar' })), 2000); };

    if (!selectedProduct) return <p>Selecione um produto no menu.</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{selectedProduct.name}</h2>
                <button onClick={onBack} className="bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(selectedProduct.content).map(item => (
                    <MaterialCard key={item.title} item={item} onShare={handleOpenShare} />
                ))}
            </div>
            {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={() => setShareModalOpen(false)} />
            )}
        </div>
    );
};

