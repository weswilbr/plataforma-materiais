// NOME DO ARQUIVO: components/InviteGenerator.js
// ATUALIZAÇÃO: O prompt enviado para a IA foi substituído por uma versão mais
// estratégica e detalhada, focada em copywriting emocional e persuasivo.

import { useState, useEffect } from 'react';
import * as Icons from './icons';
import TeleprompterModal from './Teleprompter';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

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
    const [profileDescription, setProfileDescription] = useState('');
    const [tone, setTone] = useState('amigável e inspirador');
    const [generatedResponse, setGeneratedResponse] = useState('O seu convite aparecerá aqui...');
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
            setError('Por favor, preencha o nome e a descrição do perfil.');
            return;
        }
        setIsLoading(true);
        setGeneratedResponse('');

        const prompt = `
        **Instruções para a IA:**

        **Sua Persona:** Você é um especialista em copywriting de convites estratégicos.

        **Sua Missão:** Criar um texto envolvente para convidar uma pessoa a participar de um encontro online exclusivo da Equipe do Triunfo.
        
        **Regras Essenciais:**
        1.  **Nunca** mencione diretamente "marketing de rede" ou "multinível".
        2.  Trabalhe com **emoções, dores e aspirações** do perfil indicado.
        3.  O convite deve gerar **curiosidade** e senso de **oportunidade**.
        4.  **Tom de voz:** ${tone}.
        5.  **Comprimento do convite:** entre 4 e 6 frases.
        6.  **Finalização:** Sempre finalize com um chamado leve para ação (ex.: “posso te enviar o link?”, “topa ouvir mais sobre isso?”).

        **Variáveis para Adaptar:**
        - **Nome do Convidado:** ${guestName}
        - **Perfil da pessoa (profissão, situação de vida, dores, aspirações):** "${profileDescription}"
        
        Agora, crie o convite para ${guestName}.
        `;

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
    
    return (
        <>
            <div className="bg-white dark:bg-indigo-900 p-8 rounded-lg shadow-lg space-y-8">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Gerador de Convites com IA</h2>
                 <div className="space-y-6">
                    <div><label htmlFor="guest-name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">1. Nome do Convidado</label><input type="text" id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Digite o nome aqui..." className="form-input w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label htmlFor="profile-description" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">2. Descreva o Perfil</label><textarea id="profile-description" value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows="3" placeholder="Ex: 'Colega ambicioso, bom em vendas...'" className="form-textarea w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"></textarea></div>
                    <div><label className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">3. Escolha o Tom</label><div className="flex flex-wrap gap-x-6 gap-y-2">{['amigável e inspirador', 'profissional e formal', 'entusiasmado e energético', 'direto e com senso de urgência'].map(t => (<label key={t} className="flex items-center cursor-pointer"><input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-md dark:text-slate-300 capitalize">{t.split(' ')[0]}</span></label>))}</div></div>
                    {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
                    <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-blue-700 active:bg-blue-800 transition shadow-lg disabled:bg-slate-400 flex items-center justify-center gap-3 text-lg">{isLoading ? (<><div className="loader"></div><span>A gerar...</span></>) : (<> <Icons.SparklesIcon /> <span>Gerar Convite com IA</span></>)}</button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold dark:text-slate-200">Resultado</h2>
                   </div>
                   <div className="bg-slate-100 dark:bg-indigo-800/50 rounded-lg p-4">
                        <textarea 
                            value={generatedResponse} 
                            onChange={(e) => setGeneratedResponse(e.target.value)}
                            rows="8" 
                            className="w-full bg-transparent text-slate-800 dark:text-slate-200 text-lg leading-relaxed focus:outline-none resize-none" 
                            placeholder="O seu convite aparecerá aqui..."
                        />
                   </div>
                   <div className="mt-4 flex flex-wrap gap-2 justify-end">
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
            {isTeleprompterOpen && <TeleprompterModal text={generatedResponse} onClose={() => setIsTeleprompterOpen(false)} />}
            {isShareModalOpen && <ShareToProspectModal onClose={() => setIsShareModalOpen(false)} onSelect={handleShareToProspect} />}
        </>
    );
};

export default InviteGenerator;

