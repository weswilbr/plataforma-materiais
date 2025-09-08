// NOME DO ARQUIVO: components/materials/ProductBrowser.js
// DESCRIÇÃO: Componente para navegar e ver detalhes dos materiais de cada produto.

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { materialsMap } from '../../data/materials';
import { MaterialCard } from './MaterialUI';
import ShareModal from './ShareModal';

export const ProductBrowser = ({ initialProductId, onBack }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedPitches, setGeneratedPitches] = useState({});
    const [isPitchLoading, setIsPitchLoading] = useState(null);
    const [pitchCopyButtonText, setPitchCopyButtonText] = useState({});
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

    useEffect(() => {
        if (initialProductId) {
            const product = materialsMap.productData[initialProductId] || { name: materialsMap.individualProducts.find(p => p.id === initialProductId)?.name, options: [] };
            setSelectedProduct({ id: initialProductId, ...product });
        } else {
            setSelectedProduct(null);
        }
    }, [initialProductId]);

    const callApi = async (prompt) => { try { const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), }); if (!response.ok) throw new Error('Falha na resposta da API.'); const data = await response.json(); return data.text; } catch (error) { console.error('Erro ao chamar a API:', error); return 'Ocorreu um erro ao processar seu pedido.'; } };
    const handleGeneratePitchClick = async (productId, productName) => { setIsPitchLoading(productId); const prompt = `Gere 3 opções distintas de copy de anúncio para tráfego pago, em português do Brasil, para o produto "${productName}". Cada opção deve ser curta (2-3 frases), persuasiva, usar emojis ✨ e ter uma chamada para ação clara como "Saiba Mais". Separe as 3 opções EXATAMENTE com '|||' e não adicione nenhum texto introdutório, numeração ou títulos.`; const result = await callApi(prompt); const resultsArray = result.split('|||').map(s => s.trim()).filter(Boolean); setGeneratedPitches(prev => ({ ...prev, [productId]: resultsArray })); setIsPitchLoading(null); };
    const handleCopyPitch = (textToCopy, productId, index) => { navigator.clipboard.writeText(textToCopy); const key = `${productId}-${index}`; setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiado!' })); setTimeout(() => setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiar' })), 2000); };
    
    if (!selectedProduct) {
        return (
            <div>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Navegador de Produtos</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">Selecione um produto no menu à esquerda para ver os materiais disponíveis.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{selectedProduct.name}</h2>
                <button onClick={onBack} className="bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar ao Início</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedProduct.options.map(option => {
                    const contentInfo = selectedProduct.content?.[option];
                    const materialItem = {
                        type: contentInfo?.type || 'file',
                        title: option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' '),
                        description: contentInfo ? `Acesse o material: ${option.replace(/_/g, ' ')}` : 'Conteúdo em breve.',
                        url: contentInfo?.url || '#',
                        productName: selectedProduct.name, // Adiciona o nome do produto ao material
                    };

                    if (option === 'pitch_venda') {
                        const pitches = Array.isArray(generatedPitches[selectedProduct.id]) ? generatedPitches[selectedProduct.id] : [];
                        return (
                            <div key={option} className="bg-white dark:bg-indigo-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
                                <h3 className="font-semibold text-xl mb-4 dark:text-white">Copy de Anúncio com IA</h3>
                                <div className="space-y-4">
                                    {pitches.length > 0 ? (pitches.map((pitch, index) => (<div key={index} className="bg-slate-100 dark:bg-indigo-700 p-4 rounded-lg"><p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{pitch}</p><div className="text-right mt-2"><button onClick={() => handleCopyPitch(pitch, selectedProduct.id, index)} className="bg-slate-200 dark:bg-indigo-600 text-slate-700 dark:text-slate-300 font-semibold rounded-md px-3 py-1 text-sm hover:bg-slate-300 dark:hover:bg-indigo-500 transition">{pitchCopyButtonText[`${selectedProduct.id}-${index}`] || 'Copiar'}</button></div></div>))) : (<p className="text-slate-500 dark:text-slate-400 text-center py-4">Clique no botão abaixo para gerar 3 opções de copy...</p>)}
                                </div>
                                <button onClick={() => handleGeneratePitchClick(selectedProduct.id, selectedProduct.name)} disabled={isPitchLoading === selectedProduct.id} className="mt-6 w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400">{isPitchLoading === selectedProduct.id ? (<><div className="loader"></div><span>Gerando...</span></>) : ('✨ Gerar 3 Opções de Copy')}</button>
                            </div>
                        );
                    }
                    
                    return <MaterialCard key={option} item={materialItem} filePath={`productData.${selectedProduct.id}.content.${option}`} onShare={handleOpenShare} />;
                })}
            </div>
             {shareModalOpen && selectedMaterial && (
                <ShareModal material={selectedMaterial} onClose={handleCloseShare} />
            )}
        </div>
    );
};
