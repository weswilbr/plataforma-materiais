// NOME DO ARQUIVO: components/InviteGenerator.js
// VERSÃO FINAL: Interface redesenhada com cards visuais para os objetivos.
// Adicionado um novo objetivo estratégico para convidar líderes religiosos,
// com um prompt de IA altamente personalizado. Branding atualizado.

import { useState, useEffect } from 'react';
import * as Icons from './icons';
import Teleprompter from './Teleprompter';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// --- ÍCONES ADICIONAIS PARA OS CARDS DE OBJETIVO ---
const BusinessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M4 20h16"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>;
const WellnessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.1l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.1l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const ChurchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6H6"/><path d="M12 2v4"/><path d="M12 14v8"/><path d="M14 22H8"/><path d="M18 22V10l-6-4-6 4v12"/></svg>;


// --- Sub-componente: Janela de Partilha para Prospectos ---
const ShareToProspectModal = ({ onSelect, onClose }) => {
    const { user } = useAuth();
    const [prospects, setProspects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, `users/${user.uid}/prospects`), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProspects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, [user]);

    const filteredProspects = prospects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                <header className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Partilhar com Prospecto</h3>
                    <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-700 text-white p-2 rounded-lg mt-2 border border-slate-600 focus:ring-blue-500"/>
                </header>
                <main className="p-4 overflow-y-auto">
                    {loading ? (
                        <p className="text-slate-400 text-center">A carregar...</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredProspects.length > 0 ? filteredProspects.map(prospect => (
                                <li key={prospect.id}>
                                    <button onClick={() => onSelect(prospect)} className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex justify-between items-center transition">
                                        <span className="font-medium text-white">{prospect.name}</span>
                                        <span className="text-sm text-slate-400">{prospect.whatsapp}</span>
                                    </button>
                                </li>
                            )) : <p className="text-slate-400 text-center">Nenhum prospecto encontrado.</p>}
                        </ul>
                    )}
                </main>
                <footer className="p-4 border-t border-slate-700">
                    <button onClick={onClose} className="w-full p-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg">Cancelar</button>
                </footer>
            </div>
        </div>
    );
};


const InviteGenerator = () => {
    // Estados do Gerador
    const [guestName, setGuestName] = useState('');
    const [objective, setObjective] = useState('negocio'); // 'negocio', 'feira', 'pastor'
    const [profileDescription, setProfileDescription] = useState('');
    const [tone, setTone] = useState('amigável e inspirador');
    const [generatedResponse, setGeneratedResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Estados dos Modals e Ações
    const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar');

    const callApi = async (prompt) => {
        try {
            const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Falha na resposta da API.');
            }
            const data = await response.json();
            return data.text;
        } catch (err) {
            console.error('Erro ao chamar a API:', err);
            setError(err.message);
            return null;
        }
    };

    const handleGenerateClick = async () => {
        setError('');
        if (!guestName || !profileDescription) {
            setError('Por favor, preencha o Nome e o Perfil do convidado.');
            return;
        }
        setIsLoading(true);
        setGeneratedResponse('');

        const baseInstructions = `
        **Instruções para a IA:**
        **Sua Persona:** Você é um especialista em marketing de relacionamento e copywriting, focado em criar convites que geram curiosidade e conexão genuína.
        
        **Regras Essenciais:**
        1.  **Nunca** use termos como "marketing de rede", "multinível", "pirâmide" ou "recrutar".
        2.  Foque nos **benefícios, emoções e aspirações** do perfil indicado. Use as informações do perfil para personalizar a mensagem.
        3.  O convite deve ser **breve, intrigante e despertar curiosidade**.
        4.  **Tom de voz:** ${tone}.
        5.  **Comprimento:** Idealmente entre 4 e 6 frases curtas.
        6.  **Finalização:** Sempre termine com uma pergunta aberta e de baixa pressão (ex: "Faria sentido para você dar uma olhada?", "Posso te enviar um vídeo curto sobre isso?", "O que você acha?").

        **Variáveis para Adaptar:**
        - **Nome do Convidado:** ${guestName}
        - **Perfil da pessoa (profissão, situação de vida, dores, aspirações):** "${profileDescription}"
        `;

        const businessMission = `
        **Sua Missão:** Criar um texto para convidar a pessoa para uma apresentação online sobre uma **oportunidade de negócio e diversificação de renda**. O objetivo é mostrar um caminho para mais liberdade financeira e de tempo, alinhado com a 4Life.
        `;

        const wellnessMission = `
        **Sua Missão:** Criar um texto para convidar a pessoa para uma **Feira de Bem-Estar online**. O foco é saúde, ciência e qualidade de vida. Mencione que haverá **profissionais da saúde partilhando dicas valiosas** sobre o sistema imunitário.
        `;
        
        const pastorMission = `
        **Sua Missão:** Criar um texto respeitoso e estratégico para convidar um(a) pastor(a) ou líder religioso. O objetivo é apresentar um projeto de negócio como uma **ferramenta de captação de recursos para a igreja ou comunidade**.
        - **Contexto:** Mencione que você faz parte de um projeto liderado pelo Dr. José Benjamín Pérez.
        - **Proposta de Valor:** A ideia é usar o projeto para gerar fundos que podem ajudar a igreja (melhorias, equipamentos, projetos sociais, etc.).
        - **Chamada para Ação:** O convite deve levar à proposta de assistir a um **vídeo curto de 8 minutos** que explica a visão do projeto.
        - **Tom:** Extremamente respeitoso, colaborativo e focado na missão de ajudar a comunidade.
        `;

        let missionPrompt;
        switch (objective) {
            case 'feira': missionPrompt = wellnessMission; break;
            case 'pastor': missionPrompt = pastorMission; break;
            default: missionPrompt = businessMission;
        }
        
        const prompt = baseInstructions + missionPrompt + `\nAgora, crie o convite perfeito para ${guestName}.`;

        const result = await callApi(prompt);
        if (result) {
            setGeneratedResponse(result);
        }
        setIsLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedResponse);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
    };

    const handleShareToProspect = (prospect) => {
        if (!prospect || !prospect.whatsapp) return;
        const encodedText = encodeURIComponent(generatedResponse);
        window.open(`https://wa.me/${prospect.whatsapp.replace(/\D/g, '')}?text=${encodedText}`, '_blank');
        setIsShareModalOpen(false);
    };
    
    // Componente de Card para seleção de objetivo
    const ObjectiveCard = ({ value, title, description, icon, currentObjective, setObjective }) => (
        <div 
            onClick={() => setObjective(value)}
            className={`flex-1 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${currentObjective === value ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-lg' : 'border-slate-300 dark:border-indigo-700 hover:border-blue-400'}`}
        >
            <div className={`mr-4 text-2xl ${currentObjective === value ? 'text-blue-600' : 'text-slate-500'}`}>
                {icon}
            </div>
            <div>
                <span className="block text-md font-semibold text-slate-800 dark:text-slate-200">{title}</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">{description}</span>
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 space-y-10">
                {/* Cabeçalho */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Gerador de Convites com IA</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Crie mensagens personalizadas e eficazes em segundos. Siga os 4 passos.</p>
                </div>

                {/* Passo a Passo */}
                <div className="space-y-8">
                    <div>
                        <label htmlFor="guest-name" className="block text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">1. Nome do Convidado</label>
                        <input type="text" id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Ex: Carlos Andrade" className="form-input w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" />
                    </div>
                    
                    <div>
                        <label className="block text-lg font-bold text-slate-700 dark:text-slate-300 mb-3">2. Qual o Objetivo do Convite?</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <ObjectiveCard value="negocio" title="Oportunidade" description="Apresentar o plano de negócio 4Life." icon={<BusinessIcon />} currentObjective={objective} setObjective={setObjective} />
                            <ObjectiveCard value="feira" title="Bem-Estar" description="Convidar para um evento de saúde." icon={<WellnessIcon />} currentObjective={objective} setObjective={setObjective} />
                            <ObjectiveCard value="pastor" title="Líder Religioso" description="Apresentar o projeto de ajuda à comunidade." icon={<ChurchIcon />} currentObjective={objective} setObjective={setObjective} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="profile-description" className="block text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">3. Descreva o Perfil da Pessoa</label>
                        <textarea id="profile-description" value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows="3" placeholder="Ex: Empreendedor cansado do seu trabalho atual, procura mais tempo e liberdade. Adora ajudar pessoas." className="form-textarea w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div>
                        <label className="block text-lg font-bold text-slate-700 dark:text-slate-300 mb-3">4. Escolha o Tom de Voz</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['amigável e inspirador', 'profissional e formal', 'entusiasmado e energético', 'direto e com urgência'].map(t => (
                                <label key={t} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer ${tone === t ? 'border-blue-500' : 'border-slate-300 dark:border-indigo-700'}`}>
                                    <input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 capitalize">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {error && <p className="text-red-600 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-sm font-medium">{error}</p>}
                    
                    <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-blue-700 active:bg-blue-800 transition shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                        {isLoading ? (<><div className="loader"></div><span>Gerando Texto...</span></>) : (<> <Icons.SparklesIcon /> <span>Gerar Convite com IA</span></>)}
                    </button>
                </div>
                
                {/* Área de Resultado */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                     <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Texto Gerado</h2>
                   <div className="bg-slate-100 dark:bg-indigo-800/50 rounded-lg p-1 min-h-[200px]">
                        <textarea 
                            value={generatedResponse} 
                            onChange={(e) => setGeneratedResponse(e.target.value)}
                            rows="8" 
                            className="w-full h-full bg-transparent text-slate-800 dark:text-slate-200 text-lg leading-relaxed focus:outline-none resize-none p-3" 
                            placeholder="Seu convite personalizado aparecerá aqui..."
                        />
                   </div>
                   <div className="mt-4 flex flex-wrap gap-3 justify-end">
                        <button onClick={handleCopy} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg px-4 py-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center gap-2">
                            <Icons.CopyIcon /> {copyButtonText}
                        </button>
                        <button onClick={() => setIsShareModalOpen(true)} className="bg-green-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-green-700 transition flex items-center gap-2">
                            <Icons.WhatsAppIcon /> Partilhar
                        </button>
                        <button onClick={() => setIsTeleprompterOpen(true)} className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-teal-700 transition flex items-center gap-2">
                            <Icons.PresentationIcon/>Gravar Roteiro
                        </button>
                   </div>
                </div>
            </div>
            {isTeleprompterOpen && <Teleprompter text={generatedResponse} onClose={() => setIsTeleprompterOpen(false)} />}
            {isShareModalOpen && <ShareToProspectModal onClose={() => setIsShareModalOpen(false)} onSelect={handleShareToProspect} />}
        </>
    );
};

export default InviteGenerator;