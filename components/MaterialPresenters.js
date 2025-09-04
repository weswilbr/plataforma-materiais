// NOME DO ARQUIVO: components/MaterialPresenters.js
// Agrupa todos os componentes de materiais com a nova paleta de cores.

import { useState } from 'react';
import {
    professionalTestimonials, channels, positionsData, glossaryTerms, tablesMaterials,
    trainingMaterials, rewardsMaterials, marketingMaterials, brochureMaterials,
    loyaltyMaterials, transferFactorMaterials, factoryMaterials, productData, individualProducts,
    opportunityMaterials, bonusBuilderMaterials, artsMaterials
} from '../data/materials';

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

export const MaterialCard = ({ item }) => {
    const getIcon = (type, title) => {
        if (title.toLowerCase().includes('vídeo')) return '🎬';
        if (title.toLowerCase().includes('pdf') || title.toLowerCase().includes('guia')) return '📄';
        if (title.toLowerCase().includes('powerpoint')) return '📊';
        if (title.toLowerCase().includes('youtube')) return '▶️';
        if (type === 'link') return '🔗';
        if (type === 'file') return '💾';
        return '❓';
    };
    return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" download={item.type === 'file'} className="p-6 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform flex items-start space-x-4">
            <span className="text-4xl">{getIcon(item.type, item.title)}</span>
            <div><h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3><p className="mt-1 text-slate-600 dark:text-slate-400">{item.description}</p></div>
        </a>
    );
};

// --- COMPONENTES PRINCIPAIS DE CONTEÚDO ---

// ... (Todos os outros componentes como ArtsPresenter, BrochurePresenter, etc., continuam aqui com o novo estilo)
export const ArtsPresenter = () => {
    const [view, setView] = useState('main'); // main, criativos

    const renderContentByView = () => {
        switch (view) {
            case 'criativos':
                return (
                    <>
                        <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar ao Menu de Artes</button>
                        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Modelos de Criativos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <MaterialCard item={artsMaterials.criativos.imagem_estatica} />
                            <MaterialCard item={artsMaterials.criativos.carrossel} />
                            <MaterialCard item={artsMaterials.criativos.video_curto} />
                        </div>
                    </>
                );
            case 'main':
            default:
                return (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Criação de Artes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MaterialCard item={artsMaterials.artes_fixas.arte_camiseta} />
                            <MaterialCard item={artsMaterials.artes_fixas.banner_produtos} />
                            <button onClick={() => setView('criativos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform flex items-start space-x-4">
                                <span className="text-4xl">💡</span>
                                <div>
                                    <h3 className="text-2xl font-bold dark:text-white">Criativos (Modelos)</h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">Veja modelos de imagens, carrosséis e vídeos.</p>
                                </div>
                            </button>
                        </div>
                    </>
                );
        }
    };

    return <div>{renderContentByView()}</div>;
};

// ... (Restante dos componentes como BrochurePresenter, LoyaltyPresenter, etc. com as cores atualizadas)

export const BrochurePresenter = () => {
    const [view, setView] = useState('main'); // 'main' or 'panfletos'
    if (view === 'panfletos') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Panfletos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.values(brochureMaterials.panfletos).map(item => <MaterialCard key={item.title} item={item} />)}
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Folheteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('panfletos')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📰 Ver Panfletos</h3></button>
                <MaterialCard item={brochureMaterials.catalogo} />
                <MaterialCard item={brochureMaterials.enquete} />
            </div>
        </div>
    );
};

export const LoyaltyPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Programa de Fidelidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(loyaltyMaterials).map(item => <MaterialCard key={item.title} item={item} />)}
        </div>
    </div>
);

export const TransferFactorPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Fatores de Transferência</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(transferFactorMaterials).map(item => <MaterialCard key={item.title} item={item} />)}
        </div>
    </div>
);

export const FactoryPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Vídeos da Fábrica 4Life</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(factoryMaterials).map(item => <MaterialCard key={item.title} item={item} />)}
        </div>
    </div>
);

export const ProductBrowser = () => {
    const [view, setView] = useState('main'); 
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [generatedPitches, setGeneratedPitches] = useState({}); 
    const [isPitchLoading, setIsPitchLoading] = useState(null); 
    const [pitchCopyButtonText, setPitchCopyButtonText] = useState({});
    
    const callApi = async (prompt) => { try { const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }), }); if (!response.ok) throw new Error('Falha na resposta da API.'); const data = await response.json(); return data.text; } catch (error) { console.error('Erro ao chamar a API:', error); return 'Ocorreu um erro ao processar seu pedido.'; } };
    const handleGeneratePitchClick = async (productId, productName) => { setIsPitchLoading(productId); const prompt = `Gere 3 opções distintas de copy de anúncio para tráfego pago, em português do Brasil, para o produto "${productName}". Cada opção deve ser curta (2-3 frases), persuasiva, usar emojis ✨ e ter uma chamada para ação clara como "Saiba Mais". Separe as 3 opções EXATAMENTE com '|||' e não adicione nenhum texto introdutório, numeração ou títulos.`; const result = await callApi(prompt); const resultsArray = result.split('|||').map(s => s.trim()).filter(Boolean); setGeneratedPitches(prev => ({ ...prev, [productId]: resultsArray })); setIsPitchLoading(null); };
    const handleCopyPitch = (textToCopy, productId, index) => { navigator.clipboard.writeText(textToCopy); const key = `${productId}-${index}`; setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiado!' })); setTimeout(() => setPitchCopyButtonText(prev => ({ ...prev, [key]: 'Copiar' })), 2000); };
    const handleProductSelect = (productId) => { const product = productData[productId] || { name: individualProducts.find(p => p.id === productId)?.name, options: [] }; setSelectedProduct({ id: productId, ...product }); setView('product_detail'); };
    const renderContent = (option) => { const contentInfo = selectedProduct.content?.[option] || { type: 'text', text: 'Conteúdo para esta opção ainda não foi adicionado.' }; return (<div className="mt-4 p-4 bg-slate-200 dark:bg-indigo-700/50 rounded-lg"><h4 className="font-bold capitalize">{option.replace('_', ' ')}</h4><p>{contentInfo.text}</p></div>); };

    if (view === 'product_detail') {
        return (
            <div>
                <button onClick={() => setView('individual_products')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar para a Lista de Produtos</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">{selectedProduct.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProduct.options.length > 0 ? selectedProduct.options.map(option => {
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
                        return (<div key={option} className="bg-white dark:bg-indigo-800 p-4 rounded-lg shadow-md"><h3 className="font-semibold text-lg capitalize dark:text-white">{option.replace(/_/g, ' ')}</h3>{renderContent(option)}</div>);
                    }) : <p>Nenhum material disponível para este produto ainda.</p>}
                </div>
            </div>
        );
    }
    if (view === 'individual_products') {
        return (
            <div>
                <button onClick={() => setView('main')} className="mb-6 bg-slate-200 dark:bg-indigo-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-indigo-600 transition">&larr; Voltar</button>
                <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Produtos Individuais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{individualProducts.map(product => (<button key={product.id} onClick={() => handleProductSelect(product.id)} className="p-6 bg-white dark:bg-indigo-800 rounded-lg shadow-md text-left hover:shadow-lg hover:scale-105 transition-transform"><h3 className="font-semibold text-lg dark:text-white">{product.name}</h3></button>))}</div>
            </div>
        );
    }
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Navegador de Produtos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setView('individual_products')} className="p-8 bg-white dark:bg-indigo-800 rounded-lg shadow-lg text-left hover:shadow-xl hover:scale-105 transition-transform"><h3 className="text-2xl font-bold dark:text-white">📦 Produtos Individuais</h3><p className="mt-2 text-slate-600 dark:text-slate-400">Veja a lista completa de produtos.</p></button>
                <div className="p-8 bg-slate-200 dark:bg-indigo-800/50 rounded-lg shadow-lg opacity-50 cursor-not-allowed"><h3 className="text-2xl font-bold dark:text-slate-300">🏆 Top Pack</h3><p className="mt-2 text-slate-500 dark:text-slate-400">Em breve.</p></div>
                <div className="p-8 bg-slate-200 dark:bg-indigo-800/50 rounded-lg shadow-lg opacity-50 cursor-not-allowed"><h3 className="text-2xl font-bold dark:text-slate-300">🚀 Fast Start</h3><p className="mt-2 text-slate-500 dark:text-slate-400">Em breve.</p></div>
                <div className="p-8 bg-slate-200 dark:bg-indigo-800/50 rounded-lg shadow-lg opacity-50 cursor-not-allowed"><h3 className="text-2xl font-bold dark:text-slate-300">🎁 Kits</h3><p className="mt-2 text-slate-500 dark:text-slate-400">Em breve.</p></div>
            </div>
        </div>
    );
};

export const OpportunityPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Apresentação da Oportunidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.values(opportunityMaterials).map(item => <MaterialCard key={item.title} item={item} />)}</div>
    </div>
);

export const BonusBuilderPresenter = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Bônus Construtor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Object.values(bonusBuilderMaterials).map(item => <MaterialCard key={item.title} item={item} />)}</div>
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
                    {Object.values(tablesMaterials.precos_produtos).map(item => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title.split(' ')[1]}.`}} />)}
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
                    {Object.values(tablesMaterials.precos_kits).map(item => <MaterialCard key={item.title} item={{...item, description: `Baixe a tabela de preços para ${item.title}.`}} />)}
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
                <MaterialCard item={{...tablesMaterials.pontos, description: 'Consulte a tabela de pontos dos produtos.'}} />
                <MaterialCard item={{...tablesMaterials.resgate_fidelidade, description: 'Veja a tabela para resgate de pontos.'}} />
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
                {Object.entries(glossaryTerms).map(([key, term]) => (
                    <button key={key} onClick={() => setSelectedTerm(selectedTerm === key ? null : key)} className="p-4 bg-white dark:bg-indigo-800 rounded-lg shadow-md text-left hover:shadow-lg hover:bg-slate-50 dark:hover:bg-indigo-700 transition">
                        <h3 className="font-semibold text-md dark:text-white">{term.emoji} {term.title}</h3>
                    </button>
                ))}
            </div>
            {selectedTerm && (
                <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{glossaryTerms[selectedTerm].emoji} {glossaryTerms[selectedTerm].title}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{glossaryTerms[selectedTerm].definition}</p>
                </div>
            )}
            <div className="mt-8">
                 <MaterialCard item={{type: 'file', title: 'Baixar Glossário Completo', description: 'Tenha todos os termos em um único arquivo PDF.', url: '/path/to/glossario.pdf'}} />
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
                        {Object.entries(positionsData).map(([name, details]) => (
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
                <div className={`${activeTab === 'youtube' ? 'block' : 'hidden'}`}><div className="space-y-4">{channels.youtube.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'telegram' ? 'block' : 'hidden'}`}><div className="space-y-4">{channels.telegram.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
                <div className={`${activeTab === 'whatsapp' ? 'block' : 'hidden'}`}><div className="space-y-4">{channels.whatsapp.map(channel => <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700">{channel.title}</a>)}</div></div>
            </div>
        </div>
    );
};

