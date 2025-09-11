// NOME DO ARQUIVO: components/EarningsProjector.js
// NOVO: Componente que adapta a ferramenta de projeção de ganhos e simulação de carreira para a plataforma.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { materialsMap } from '../data';

const EarningsProjector = () => {
    const Positions = materialsMap.positionsData;
    const DolarToReal = 4.00;
    const LS_KEY_SIMULATOR = 'careerSimulatorState';

    // Estado geral
    const [activeTab, setActiveTab] = useState('projetor');

    // Estado do Projetor de Ganhos
    const [inscritosNivel1, setInscritosNivel1] = useState(3);
    const [inscritosNivel2, setInscritosNivel2] = useState(3);
    const [inscritosNivel3, setInscritosNivel3] = useState(2);
    const [inscritosNivel4, setInscritosNivel4] = useState(1);
    const [mediaLP, setMediaLP] = useState(125);

    // Estado do Simulador de Ranking
    const [pvMensal, setPvMensal] = useState('');
    const [inscritosPessoais, setInscritosPessoais] = useState('');
    const [lp3Niveis, setLp3Niveis] = useState('');
    const [voRede, setVoRede] = useState('');
    const [linhasQualificadas, setLinhasQualificadas] = useState({});
    const [simulationResult, setSimulationResult] = useState(null);

    // Estado do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    // Carregar estado do simulador do Local Storage
    useEffect(() => {
        const savedState = localStorage.getItem(LS_KEY_SIMULATOR);
        if (savedState) {
            const state = JSON.parse(savedState);
            setPvMensal(state.pvMensal || '');
            setInscritosPessoais(state.inscritosPessoais || '');
            setLp3Niveis(state.lp3Niveis || '');
            setVoRede(state.voRede || '');
            setLinhasQualificadas(state.linhasQualificadas || {});
        }
    }, []);

    // Salvar estado do simulador no Local Storage
    const saveState = useCallback(() => {
        const state = { pvMensal, inscritosPessoais, lp3Niveis, voRede, linhasQualificadas };
        localStorage.setItem(LS_KEY_SIMULATOR, JSON.stringify(state));
    }, [pvMensal, inscritosPessoais, lp3Niveis, voRede, linhasQualificadas]);

    // Projeção de Ganhos (Memoizado para performance)
    const earningsProjection = useMemo(() => {
        const n1 = parseInt(inscritosNivel1);
        const n2_avg = parseInt(inscritosNivel2);
        const n3_avg = parseInt(inscritosNivel3);
        const n4_avg = parseInt(inscritosNivel4);
        const lp = parseInt(mediaLP);

        const totalN1 = n1;
        const totalN2 = totalN1 * n2_avg;
        const totalN3 = totalN2 * n3_avg;
        const totalN4 = totalN3 * n4_avg;
        
        const comissao1 = (totalN1 * lp * 0.02) * DolarToReal;
        const comissao2 = (totalN2 * lp * 0.25) * DolarToReal;
        const comissao3 = (totalN3 * lp * 0.05) * DolarToReal;
        const comissao4 = (totalN4 * lp * 0.06) * DolarToReal;
        const ganhoTotal = comissao1 + comissao2 + comissao3 + comissao4;

        return {
            totalEquipe: totalN1 + totalN2 + totalN3 + totalN4,
            comissaoNivel1: comissao1,
            comissaoNivel2: comissao2,
            comissaoNivel3: comissao3,
            comissaoNivel4: comissao4,
            ganhoTotal,
        };
    }, [inscritosNivel1, inscritosNivel2, inscritosNivel3, inscritosNivel4, mediaLP]);
    
    // Funções do Simulador
    const handleAddLinha = () => {
        const pos = document.getElementById('linhaQualificadaPosicao').value;
        const qtd = parseInt(document.getElementById('linhaQualificadaQtd').value, 10);
        if (pos && qtd > 0) {
            setLinhasQualificadas(prev => ({...prev, [pos]: (prev[pos] || 0) + qtd }));
            document.getElementById('linhaQualificadaQtd').value = '';
        }
    };
    
    const handleRemoveLinha = (pos) => {
        setLinhasQualificadas(prev => {
            const newState = {...prev};
            delete newState[pos];
            return newState;
        });
    };

    const handleSimulate = () => {
        const userInput = {
            pvMensal: parseInt(pvMensal, 10) || 0,
            inscritosPessoais: parseInt(inscritosPessoais, 10) || 0,
            lp3Niveis: parseInt(lp3Niveis, 10) || 0,
            voRede: parseInt(voRede, 10) || 0,
            linhasQualificadas,
        };

        const checkRequirements = (userInput, rankReqs) => {
            if (rankReqs.pv_mensal && userInput.pvMensal < rankReqs.pv_mensal) return false;
            if (rankReqs.inscritos_pessoais && userInput.inscritosPessoais < rankReqs.inscritos_pessoais) return false;
            if (rankReqs.lp_nos_3_niveis && userInput.lp3Niveis < rankReqs.lp_nos_3_niveis) return false;
            if (rankReqs.vo_rede && userInput.voRede < rankReqs.vo_rede) return false;
            if (rankReqs.linhas_qualificadas) {
                for (const req of rankReqs.linhas_qualificadas) {
                    if ((userInput.linhasQualificadas[req.posicao] || 0) < req.quantidade) return false;
                }
            }
            return true;
        };
        
        const achievedRankName = Object.keys(Positions).reverse().find(posName => checkRequirements(userInput, Positions[posName])) || null;
        setSimulationResult({ userInput, rankName: achievedRankName });
        saveState();
    };
    
    const handleResetSimulator = () => {
        setPvMensal('');
        setInscritosPessoais('');
        setLp3Niveis('');
        setVoRede('');
        setLinhasQualificadas({});
        setSimulationResult(null);
        localStorage.removeItem(LS_KEY_SIMULATOR);
    };

    // Funções do Modal
    const handleOpenModal = (posName) => {
        setSelectedPosition(Positions[posName]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    
    // Funções de formatação
    const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatNumber = (value) => (value || 0).toLocaleString('pt-BR');
    
    // Componentes de UI
    const ProgressBar = ({ label, current, target }) => {
        if (!target) return null;
        const percentage = Math.min((current / target) * 100, 100);
        return (
            <div>
                <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-slate-300">{label}</span>
                    <span className="font-medium text-slate-400">{formatNumber(current)} / {formatNumber(target)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    const DetailItem = ({ label, value }) => {
        if (value === null || value === undefined) return null;
        return (
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                <span className="font-semibold text-slate-400">{label}:</span>
                <span className="font-bold text-slate-200">{value}</span>
            </div>
        );
    };

    return (
        <>
            <style>{`
                body { font-family: 'Poppins', sans-serif; }
                .card-gradient { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(71, 85, 105, 0.3); }
                .modal-backdrop { background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px); }
                .form-input { background-color: #334155; border: 1px solid #475569; color: #f1f5f9; transition: border-color 0.3s, box-shadow 0.3s; }
                .form-input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.4); }
                .form-input::placeholder { color: #94a3b8; }
                [data-tooltip] { position: relative; cursor: help; }
                [data-tooltip]::after { content: attr(data-tooltip); position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background-color: #0f172a; color: #e2e8f0; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.3s; z-index: 10; border: 1px solid #334155; }
                [data-tooltip]:hover::after { opacity: 1; visibility: visible; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
                input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: #334155; border-radius: 5px; outline: none; }
                input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; background: #38bdf8; cursor: pointer; border-radius: 50%; border: 4px solid #0f172a; transition: transform 0.2s; }
                input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.1); }
                .tab-button { transition: all 0.3s; border-bottom: 2px solid transparent; }
                .tab-button.active { color: #38bdf8; border-bottom-color: #38bdf8; }
            `}</style>
            <div className="container mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Projetor de Ganhos e Carreira</h1>
                    <p className="text-lg text-slate-400">Simule sua equipe em 4 níveis e projete seus ganhos mensais.</p>
                </header>

                <div className="mb-8 flex justify-center border-b border-slate-700">
                    <button onClick={() => setActiveTab('projetor')} className={`tab-button text-lg font-semibold py-3 px-6 ${activeTab === 'projetor' && 'active'}`}>Projetor de Ganhos</button>
                    <button onClick={() => setActiveTab('simulador')} className={`tab-button text-lg font-semibold py-3 px-6 ${activeTab === 'simulador' && 'active'}`}>Simulador de Ranking</button>
                </div>
                
                {activeTab === 'projetor' && (
                    <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 card-gradient rounded-xl shadow-2xl animate-fadeIn">
                             <h2 className="text-2xl font-bold text-white mb-6">Monte sua Equipe (até 4 níveis)</h2>
                             <div className="space-y-5">
                                 <div>
                                     <label htmlFor="inscritosNivel1" className="block text-md font-medium text-slate-300 mb-2">1º Nível (Seus diretos): <span className="text-sky-400 font-bold">{inscritosNivel1}</span></label>
                                     <input type="range" id="inscritosNivel1" min="0" max="20" value={inscritosNivel1} onChange={e => setInscritosNivel1(e.target.value)} className="w-full"/>
                                 </div>
                                 <div>
                                     <label htmlFor="inscritosNivel2" className="block text-md font-medium text-slate-300 mb-2">2º Nível (Média por pessoa do 1º): <span className="text-sky-400 font-bold">{inscritosNivel2}</span></label>
                                     <input type="range" id="inscritosNivel2" min="0" max="10" value={inscritosNivel2} onChange={e => setInscritosNivel2(e.target.value)} className="w-full"/>
                                 </div>
                                  <div>
                                      <label htmlFor="inscritosNivel3" className="block text-md font-medium text-slate-300 mb-2">3º Nível (Média por pessoa do 2º): <span className="text-sky-400 font-bold">{inscritosNivel3}</span></label>
                                      <input type="range" id="inscritosNivel3" min="0" max="10" value={inscritosNivel3} onChange={e => setInscritosNivel3(e.target.value)} className="w-full"/>
                                  </div>
                                  <div>
                                      <label htmlFor="inscritosNivel4" className="block text-md font-medium text-slate-300 mb-2">4º Nível (Média por pessoa do 3º): <span className="text-sky-400 font-bold">{inscritosNivel4}</span></label>
                                      <input type="range" id="inscritosNivel4" min="0" max="10" value={inscritosNivel4} onChange={e => setInscritosNivel4(e.target.value)} className="w-full"/>
                                  </div>
                                  <div>
                                      <label htmlFor="mediaLP" className="block text-md font-medium text-slate-300 mb-2">Média de pontos (LP) por pessoa: <span className="text-sky-400 font-bold">{mediaLP} LP</span></label>
                                      <input type="range" id="mediaLP" min="50" max="500" value={mediaLP} step="5" onChange={e => setMediaLP(e.target.value)} className="w-full"/>
                                  </div>
                             </div>
                              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg text-center">
                                  <p className="text-sm text-slate-400">Total de pessoas na equipe (4 níveis):</p>
                                  <p className="text-2xl font-bold text-white">{formatNumber(earningsProjection.totalEquipe)}</p>
                              </div>
                        </div>
                        <div className="p-6 card-gradient rounded-xl shadow-2xl flex flex-col justify-center items-center text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
                             <h2 className="text-2xl font-bold text-white mb-4">Projeção de Ganhos Mensais</h2>
                              <div className="bg-green-600/10 border border-green-500 rounded-xl p-4 w-full">
                                  <p className="text-lg text-green-300">Ganho Total Estimado</p>
                                  <p className="text-5xl font-bold text-white my-2">{formatCurrency(earningsProjection.ganhoTotal)}</p>
                              </div>
                              <div className="w-full mt-6 space-y-3">
                                  <DetailItem label="Comissão 1º Nível (2%)" value={formatCurrency(earningsProjection.comissaoNivel1)} />
                                  <DetailItem label="Comissão 2º Nível (25%)" value={formatCurrency(earningsProjection.comissaoNivel2)} />
                                  <DetailItem label="Comissão 3º Nível (5%)" value={formatCurrency(earningsProjection.comissaoNivel3)} />
                                  <DetailItem label="Comissão 4º Nível (6%)" value={formatCurrency(earningsProjection.comissaoNivel4)} />
                              </div>
                              <p className="text-xs text-slate-500 mt-6">*Projeção para fins ilustrativos, com base nas comissões de rede recorrentes e câmbio de R$ 4,00. Ganhos reais podem variar.</p>
                        </div>
                    </main>
                )}

                {activeTab === 'simulador' && (
                     <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2 p-6 card-gradient rounded-xl shadow-2xl animate-fadeIn">
                             <div className="flex justify-between items-center mb-6">
                                 <h2 className="text-2xl font-bold text-white">Simulador de Ranking</h2>
                                 <button onClick={handleResetSimulator} data-tooltip="Limpar todos os campos" className="text-slate-400 hover:text-white transition-colors">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l16 16"/></svg>
                                 </button>
                             </div>
                             <div className="space-y-4">
                                  <div>
                                      <label htmlFor="pvMensal" className="block text-sm font-medium text-slate-300 mb-1">
                                          Seu PV Mensal <span data-tooltip="Pontos de Volume Pessoal" className="text-sky-400">(?)</span>
                                      </label>
                                      <input type="number" id="pvMensal" value={pvMensal} onChange={e => setPvMensal(e.target.value)} className="w-full p-2 rounded-md form-input" placeholder="Ex: 50"/>
                                  </div>
                                   <div>
                                       <label htmlFor="inscritosPessoais" className="block text-sm font-medium text-slate-300 mb-1">Inscritos Pessoais Ativos</label>
                                       <input type="number" id="inscritosPessoais" value={inscritosPessoais} onChange={e => setInscritosPessoais(e.target.value)} className="w-full p-2 rounded-md form-input" placeholder="Ex: 3"/>
                                   </div>
                                   <div>
                                       <label htmlFor="lp3Niveis" className="block text-sm font-medium text-slate-300 mb-1">
                                           LP nos 3 Níveis <span data-tooltip="Pontos de Liderança nos seus primeiros 3 níveis" className="text-sky-400">(?)</span>
                                       </label>
                                       <input type="number" id="lp3Niveis" value={lp3Niveis} onChange={e => setLp3Niveis(e.target.value)} className="w-full p-2 rounded-md form-input" placeholder="Ex: 1000"/>
                                   </div>
                                   <div>
                                       <label htmlFor="voRede" className="block text-sm font-medium text-slate-300 mb-1">
                                           Volume Organizacional <span data-tooltip="Volume total de pontos da sua equipe" className="text-sky-400">(?)</span>
                                       </label>
                                       <input type="number" id="voRede" value={voRede} onChange={e => setVoRede(e.target.value)} className="w-full p-2 rounded-md form-input" placeholder="Ex: 50000"/>
                                   </div>
                                   <div className="pt-4">
                                       <h3 className="text-lg font-semibold text-white mb-2">Linhas Qualificadas</h3>
                                       <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-2">
                                           {Object.keys(linhasQualificadas).length === 0 ? <p className="text-slate-500 text-sm">Nenhuma linha adicionada.</p> : 
                                            Object.entries(linhasQualificadas).map(([pos, qtd]) => (
                                                <div key={pos} className="flex justify-between items-center bg-slate-900/50 p-2 rounded animate-fadeIn">
                                                    <span>{qtd}x {pos}</span>
                                                    <button onClick={() => handleRemoveLinha(pos)} className="remove-linha-btn text-red-500 hover:text-red-400 font-bold text-xs p-1">REMOVER</button>
                                                </div>
                                            ))
                                           }
                                       </div>
                                       <div className="flex gap-2">
                                           <select id="linhaQualificadaPosicao" className="w-full p-2 rounded-md form-input">
                                                {Object.keys(Positions).map(name => <option key={name} value={name}>{name}</option>)}
                                           </select>
                                           <input type="number" id="linhaQualificadaQtd" className="w-24 p-2 rounded-md form-input" placeholder="Qtd" />
                                           <button onClick={handleAddLinha} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">+</button>
                                       </div>
                                   </div>
                             </div>
                             <button onClick={handleSimulate} className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/30">
                                 Calcular Ranking
                             </button>
                        </div>
                        <div className="lg:col-span-3 p-6 card-gradient rounded-xl shadow-2xl flex flex-col justify-center items-center text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
                            {!simulationResult ? (
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    <h2 className="mt-4 text-2xl font-bold text-white">Resultado do Ranking</h2>
                                    <p className="mt-2 text-slate-400">Preencha os dados para ver sua qualificação.</p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn w-full">
                                    {!simulationResult.rankName ? (
                                        <>
                                            <h3 className="text-2xl font-bold text-yellow-400">Você ainda não se qualificou.</h3>
                                            <p className="mt-2 text-slate-400">Continue para alcançar Associate.</p>
                                            <div className="w-full mt-6 space-y-4">
                                                <ProgressBar label="PV Mensal" current={simulationResult.userInput.pvMensal} target={Positions.Associate.pv_mensal} />
                                                <ProgressBar label="Inscritos" current={simulationResult.userInput.inscritosPessoais} target={Positions.Associate.inscritos_pessoais} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg text-slate-400">Seu Ranking Atual</p>
                                            <h3 className="text-4xl font-bold text-sky-400 my-2">{Positions[simulationResult.rankName].emoji} {simulationResult.rankName}</h3>
                                            <p className="text-xl font-semibold text-white">Ganhos médios de {formatCurrency(Positions[simulationResult.rankName].media_ganho)}</p>
                                            
                                            {Positions[simulationResult.rankName].progressao_para && (
                                                <div className="mt-8 w-full">
                                                    <h4 className="text-xl font-bold mb-4 text-white border-b border-slate-600 pb-2">Progresso para {Positions[simulationResult.rankName].progressao_para} {Positions[Positions[simulationResult.rankName].progressao_para].emoji}</h4>
                                                    <div className="space-y-3 text-left">
                                                        <ProgressBar label="PV Mensal" current={simulationResult.userInput.pvMensal} target={Positions[Positions[simulationResult.rankName].progressao_para].pv_mensal} />
                                                        <ProgressBar label="Inscritos" current={simulationResult.userInput.inscritosPessoais} target={Positions[Positions[simulationResult.rankName].progressao_para].inscritos_pessoais} />
                                                        {Positions[Positions[simulationResult.rankName].progressao_para].lp_nos_3_niveis && <ProgressBar label="LP 3 Níveis" current={simulationResult.userInput.lp3Niveis} target={Positions[Positions[simulationResult.rankName].progressao_para].lp_nos_3_niveis} />}
                                                        {Positions[Positions[simulationResult.rankName].progressao_para].vo_rede && <ProgressBar label="VO Rede" current={simulationResult.userInput.voRede} target={Positions[Positions[simulationResult.rankName].progressao_para].vo_rede} />}
                                                        {Positions[Positions[simulationResult.rankName].progressao_para].linhas_qualificadas?.map(req => 
                                                            <ProgressBar key={req.posicao} label={`Linhas ${req.posicao}`} current={simulationResult.userInput.linhasQualificadas[req.posicao] || 0} target={req.quantidade} />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                     </main>
                )}
                 <div className="mt-16">
                     <h2 className="text-3xl font-bold text-center mb-8 text-white">Guia de Posições</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Object.keys(Positions).map(posName => (
                             <div key={posName} onClick={() => handleOpenModal(posName)} className="p-4 card-gradient rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-sky-500/20">
                                 <div className="flex items-center space-x-4">
                                     <span className="text-4xl">{Positions[posName].emoji}</span>
                                     <div>
                                        <h3 className="text-lg font-bold text-white">{posName}</h3>
                                        <p className="text-sm text-slate-400">{Positions[posName].nivel_categoria}</p>
                                     </div>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </div>
            </div>

            {isModalOpen && selectedPosition && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={handleCloseModal}>
                    <div className="card-gradient rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="text-center mb-6">
                            <span className="text-6xl">{selectedPosition.emoji}</span>
                            <h2 className="text-3xl font-bold mt-2 text-white">{Object.keys(Positions).find(key => Positions[key] === selectedPosition)}</h2>
                            <p className="text-md text-sky-400">{selectedPosition.nivel_categoria}</p>
                        </div>
                        <div className="space-y-3">
                            <DetailItem label="Ganhos Médios" value={formatCurrency(selectedPosition.media_ganho)} />
                            <DetailItem label="PV Mensal" value={`${selectedPosition.pv_mensal} PV`} />
                            <DetailItem label="Inscritos Pessoais" value={`${selectedPosition.inscritos_pessoais} ativos`} />
                            {selectedPosition.lp_nos_3_niveis && <DetailItem label="LP nos 3 Níveis" value={`${formatNumber(selectedPosition.lp_nos_3_niveis)} LP`} />}
                            {selectedPosition.vo_rede && <DetailItem label="Volume Organizacional" value={`${formatNumber(selectedPosition.vo_rede)} VO`} />}
                            <DetailItem label="Linhas Qualificadas" value={selectedPosition.linhas_qualificadas ? selectedPosition.linhas_qualificadas.map(l => `${l.quantidade}x ${l.posicao}`).join(', ') : 'N/A'} />
                            <DetailItem label="Reconhecimento" value={selectedPosition.reconhecimento} />
                            {selectedPosition.progressao_para && <DetailItem label="Próximo Nível" value={selectedPosition.progressao_para} />}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default EarningsProjector;
