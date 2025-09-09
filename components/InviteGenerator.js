// NOME DO ARQUIVO: components/InviteGenerator.js
// ATUALIZAÇÃO: O componente foi simplificado para focar apenas na geração de
// texto, enquanto a lógica do teleprompter foi movida para o seu próprio arquivo.

import { useState } from 'react';
import * as Icons from './icons';
import TeleprompterModal from './Teleprompter'; // Importa o novo componente

const InviteGenerator = () => {
    // Estados do Gerador
    const [guestName, setGuestName] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [tone, setTone] = useState('profissional e formal');
    const [generatedResponse, setGeneratedResponse] = useState('O seu convite aparecerá aqui...');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

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
        const prompt = `Crie um convite curto e direto para WhatsApp, focado em marketing de rede para a "Equipe de Triunfo", em português do Brasil. O texto deve ser breve (no máximo 3 ou 4 frases curtas) e terminar com uma pergunta para incentivar a resposta. O tom do convite deve ser ${tone}. O nome do convidado é ${guestName}. O perfil do convidado é: "${profileDescription}". O objetivo é despertar o interesse para uma apresentação de negócio.`;
        const result = await callApi(prompt);
        if (result) {
            setGeneratedResponse(result);
        }
        setIsLoading(false);
    };
    
    return (
        <>
            <div className="bg-white dark:bg-indigo-900 p-8 rounded-lg shadow-lg space-y-8">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Gerador de Convites com IA</h2>
                 <div className="space-y-6">
                    <div><label htmlFor="guest-name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">1. Nome do Convidado</label><input type="text" id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Digite o nome aqui..." className="form-input w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label htmlFor="profile-description" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">2. Descreva o Perfil</label><textarea id="profile-description" value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows="3" placeholder="Ex: 'Colega ambicioso, bom em vendas...'" className="form-textarea w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"></textarea></div>
                    <div><label className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">3. Escolha o Tom</label><div className="flex flex-wrap gap-x-6 gap-y-2">{['profissional e formal', 'amigável e informal', 'entusiasmado e energético', 'direto e com senso de urgência', 'inspirador e motivacional'].map(t => (<label key={t} className="flex items-center cursor-pointer"><input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-md dark:text-slate-300 capitalize">{t.split(' ')[0]}</span></label>))}</div></div>
                    {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
                    <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-blue-700 active:bg-blue-800 transition shadow-lg disabled:bg-slate-400 flex items-center justify-center gap-3 text-lg">{isLoading ? (<><div className="loader"></div><span>A gerar...</span></>) : (<> <Icons.SparklesIcon /> <span>Gerar Convite com IA</span></>)}</button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold dark:text-slate-200">Resultado</h2>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setIsTeleprompterOpen(true)} className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-teal-700 transition flex items-center gap-2">
                                <Icons.PresentationIcon/>Gravar Roteiro
                            </button>
                        </div>
                    </div>
                     <div className="relative">
                        <textarea value={generatedResponse} readOnly rows="10" className="w-full bg-slate-100 dark:bg-indigo-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4" placeholder="O seu convite aparecerá aqui..."></textarea>
                     </div>
                </div>
            </div>
            {isTeleprompterOpen && <TeleprompterModal text={generatedResponse} onClose={() => setIsTeleprompterOpen(false)} />}
        </>
    );
};

export default InviteGenerator;