// NOME DO ARQUIVO: components/MaterialPresenters.js
// Versão final com todos os componentes de materiais, novo design e correções de bugs.

import { useState, useEffect } from 'react';
import { materialsMap } from '../data/materials';

// --- ÍCONES SVG ---
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>;
const PdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M4 12V4a2 2 0 0 1 2-2h8l4 4v4"></path><path d="M4 20h1.5a1.5 1.5 0 0 0 0-3H4v3Z"></path><path d="M14.5 20h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1v5Z"></path><path d="M10 15h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"></path></svg>;
const PptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z"></path><path d="M4 15h16"></path><path d="M8 11h.01"></path><path d="M12 11h.01"></path><path d="M16 11h.01"></path><path d="M8 7h.01"></path><path d="M12 7h.01"></path><path d="M16 7h.01"></path></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v-6l5 3-5 3Z"></path><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7 4 12 4s9.5 2 9.5 3a24.12 24.12 0 0 1 0 10c0 1-4.5 3-9.5 3s-9.5-2-9.5-3Z"></path></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const DefaultIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>;


// --- COMPONENTES AUXILIARES ---

export const MaterialViewer = ({ title, children }) => (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">{title}</h2>
        {children ? (
            <div className="bg-white dark:bg-indigo-900 p-6 rounded-lg shadow-lg">
                {children}
            </div>
        ) : (
            <div className="bg-slate-100 dark:bg-indigo-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 min-h-[50vh] flex items-center justify-center"><p className="text-slate-500 text-xl text-center">O conteúdo e os materiais para esta seção<br />estarão disponíveis em breve.</p></div>
        )}
    </div>
);

export const MaterialCard = ({ item, filePath }) => {
    const getIcon = (type, title) => {
        if (title.toLowerCase().includes('vídeo')) return <VideoIcon />;
        if (title.toLowerCase().includes('pdf') || title.toLowerCase().includes('guia')) return <PdfIcon />;
        if (title.toLowerCase().includes('powerpoint')) return <PptIcon />;
        if (title.toLowerCase().includes('youtube')) return <YoutubeIcon />;
        if (type === 'link') return <LinkIcon />;
        if (type === 'file') return <DownloadIcon />;
        return <DefaultIcon />;
    };

    const url = item.type === 'file' ? `/api/download?path=${filePath}` : item.url;
    const target = item.type === 'link' ? '_blank' : '_self';
    const downloadAttribute = item.type === 'file' ? {} : { download: true };

    return (
        <a href={url} target={target} rel="noopener noreferrer" {...downloadAttribute} className="group p-6 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform flex items-start space-x-4">
            <div className="text-blue-500 dark:text-blue-400 mt-1">
                {getIcon(item.type, item.title)}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>
        </a>
    );
};

// --- COMPONENTES PRINCIPAIS DE CONTEÚDO ---

export const ArtsPresenter = () => {
    const [view, setView] = useState('main');

    if (view === 'criativos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar ao Menu de Artes</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Modelos de Criativos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(materialsMap.artsMaterials.criativos).map(([key, item]) => 
                        <MaterialCard key={item.title} item={item} filePath={`artsMaterials.criativos.${key}`} />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Criação de Artes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(materialsMap.artsMaterials.artes_fixas).map(([key, item]) => 
                    <MaterialCard key={item.title} item={item} filePath={`artsMaterials.artes_fixas.${key}`} />
                )}
                <button onClick={() => setView('criativos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform flex items-start space-x-4">
                    <span className="text-4xl">💡</span>
                    <div>
                        <h3 className="text-2xl font-bold dark:text-white">Criativos (Modelos)</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Veja modelos de imagens, carrosséis e vídeos.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export const BrochurePresenter = () => {
    const [view, setView] = useState('main');
    if (view === 'panfletos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Panfletos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.brochureMaterials.panfletos).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`brochureMaterials.panfletos.${key}`} />)}
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Folheteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('panfletos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📰 Ver Panfletos</h3></button>
                <MaterialCard item={materialsMap.brochureMaterials.catalogo} filePath="brochureMaterials.catalogo" />
                <MaterialCard item={materialsMap.brochureMaterials.enquete} filePath="brochureMaterials.enquete" />
            </div>
        </div>
    );
};

export const LoyaltyPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Programa de Fidelidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.loyaltyMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`loyaltyMaterials.${key}`} />)}
        </div>
    </div>
);

export const TransferFactorPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Fatores de Transferência</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.transferFactorMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`transferFactorMaterials.${key}`} />)}
        </div>
    </div>
);

export const FactoryPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Vídeos da Fábrica 4Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialsMap.factoryMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`factoryMaterials.${key}`} />)}
        </div>
    </div>
);

export const ProductBrowser = ({ initialProductId, onBack }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedPitches, setGeneratedPitches] = useState({});
    const [isPitchLoading, setIsPitchLoading] = useState(null);
    const [pitchCopyButtonText, setPitchCopyButtonText] = useState({});

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProduct.options.map(option => {
                    if (option === 'pitch_venda') {
                        const pitches = Array.isArray(generatedPitches[selectedProduct.id]) ? generatedPitches[selectedProduct.id] : [];
                        return (
                            <div key={option} className="bg-white dark:bg-indigo-800 p-4 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
                                <h3 className="font-semibold text-lg mb-2 dark:text-white">Copy de Anúncio com IA</h3>
                                <div className="space-y-4">
                                    {pitches.length > 0 ? (pitches.map((pitch, index) => (<div key={index} className="bg-slate-100 dark:bg-indigo-700 p-3 rounded-lg"><p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{pitch}</p><div className="text-right mt-2"><button onClick={() => handleCopyPitch(pitch, selectedProduct.id, index)} className="bg-slate-200 dark:bg-indigo-600 text-slate-700 dark:text-slate-300 font-semibold rounded-md px-3 py-1 text-sm hover:bg-slate-300 dark:hover:bg-indigo-500 transition">{pitchCopyButtonText[`${selectedProduct.id}-${index}`] || 'Copiar'}</button></div></div>))) : (<p className="text-slate-500 dark:text-slate-400 text-center py-4">Clique no botão abaixo para gerar 3 opções de copy...</p>)}
                                </div>
                                <button onClick={() => handleGeneratePitchClick(selectedProduct.id, selectedProduct.name)} disabled={isPitchLoading === selectedProduct.id} className="mt-4 w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400">{isPitchLoading === selectedProduct.id ? (<><div className="loader"></div><span>Gerando...</span></>) : ('✨ Gerar 3 Opções de Copy')}</button>
                            </div>
                        );
                    }
                    
                    const contentInfo = selectedProduct.content?.[option];
                    const materialItem = {
                        type: contentInfo?.type || 'file',
                        title: option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' '),
                        description: contentInfo ? `Acesse o material: ${option.replace(/_/g, ' ')}` : 'Conteúdo em breve.',
                        url: contentInfo?.url || '#'
                    };
                    return <MaterialCard key={option} item={materialItem} filePath={`productData.${selectedProduct.id}.content.${option}`} />;
                })}
            </div>
        </div>
    );
};

export const OpportunityPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Apresentação da Oportunidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(materialsMap.opportunityMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`opportunityMaterials.${key}`} />)}</div>
    </div>
);

export const BonusBuilderPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Bônus Construtor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.entries(materialsMap.bonusBuilderMaterials).map(([key, item]) => <MaterialCard key={item.title} item={item} filePath={`bonusBuilderMaterials.${key}`} />)}</div>
    </div>
);


export const TablesPresenter = () => {
    const [view, setView] = useState('main');
    if (view === 'precos_produtos') {
         return (
            <div>
                <button onClick={() => setView('precos')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Preços de Produtos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.tablesMaterials.precos_produtos).map(([key, item]) => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title.split(' ')[1]}.`}} filePath={`tablesMaterials.precos_produtos.${key}`} />)}
                </div>
            </div>
        )
    }
    if (view === 'precos_kits') {
        return (
            <div>
                <button onClick={() => setView('precos')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Preços de Kits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(materialsMap.tablesMaterials.precos_kits).map(([key, item]) => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title}.`}} filePath={`tablesMaterials.precos_kits.${key}`} />)}
                </div>
            </div>
        )
    }
    if (view === 'precos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Tabela de Preços</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setView('precos_produtos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📦 Produtos</h3></button>
                    <button onClick={() => setView('precos_kits')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">🎁 Kits</h3></button>
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Menu de Tabelas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('precos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📊 Tabela de Preços</h3></button>
                <MaterialCard item={{...materialsMap.tablesMaterials.pontos, description: 'Consulte a tabela de pontos dos produtos.'}} filePath="tablesMaterials.pontos" />
                <MaterialCard item={{...materialsMap.tablesMaterials.resgate_fidelidade, description: 'Veja a tabela para resgate de pontos.'}} filePath="tablesMaterials.resgate_fidelidade" />
            </div>
        </div>
    );
};

export const GlossaryPresenter = () => {
    const [selectedTerm, setSelectedTerm] = useState(null);
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Glossário de Termos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(materialsMap.glossaryTerms).map(([key, term]) => (
                    <button key={key} onClick={() => setSelectedTerm(selectedTerm === key ? null : key)} className="p-4 bg-white dark:bg-indigo-800 rounded-lg shadow-md text-left hover:shadow-lg hover:bg-slate-50 dark:hover:bg-indigo-700 transition">
                        <h3 className="font-semibold text-md dark:text-white">{term.emoji} {term.title}</h3>
                    </button>
                ))}
            </div>
            {selectedTerm && (
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{materialsMap.glossaryTerms[selectedTerm].emoji} {materialsMap.glossaryTerms[selectedTerm].title}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{materialsMap.glossaryTerms[selectedTerm].definition}</p>
                </div>
            )}
            <div className="mt-8">
                 <MaterialCard item={{type: 'file', title: 'Baixar Glossário Completo', description: 'Tenha todos os termos em um único arquivo PDF.', url: '/path/to/glossario.pdf'}} filePath="glossaryTerms.download" />
            </div>
        </div>
    );
};

export const RankingPresenter = () => {
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };
    const formatValue = (value, suffix = '') => {
        if (value === null || value === undefined) return 'N/A';
        return `${value.toLocaleString('pt-BR')}${suffix}`;
    };
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
                                <td className="px-6 py-4">{details.viagens_incentivo ? '✅ Sim' : '❌ Não'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const ChannelsPresenter = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Canais Oficiais</h2>
            <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'youtube' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('youtube')} type="button">📺 YouTube</button></li>
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'telegram' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('telegram')} type="button">📲 Telegram</button></li>
                    <li className="mr-2" role="presentation"><button className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'whatsapp' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`} onClick={() => setActiveTab('whatsapp')} type="button">💬 WhatsApp</button></li>
                </ul>
            </div>
            <div>
                <div className={`${activeTab === 'youtube' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.youtube.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'telegram' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.telegram.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'whatsapp' ? 'block' : 'hidden'}`}><div className="space-y-4">{materialsMap.channels.whatsapp.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
            </div>
        </div>
    );
};

