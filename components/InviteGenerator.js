// NOME DO ARQUIVO: components/InviteGenerator.js
// Componente para o gerador de convites com IA, com novo design e prompt otimizado.

import { useState, useRef } from 'react';

// O Modal do Teleprompter é um sub-componente e pode viver no mesmo arquivo para simplicidade.
const TeleprompterModal = ({ text, onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingType, setRecordingType] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startRecording = async (type) => {
        setError('');
        setMediaUrl(null);
        if (isRecording) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
            streamRef.current = stream;
            if (type === 'video' && videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            const chunks = [];
            recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setMediaUrl(url);
            };
            recorder.start();
            setIsRecording(true);
            setRecordingType(type);
        } catch (err) {
            console.error("Erro ao acessar mídia:", err);
            setError('Não foi possível acessar a câmera/microfone. Verifique as permissões do navegador.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsRecording(false);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    return (
       <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b dark:border-slate-700"><h3 className="text-xl font-bold text-slate-900 dark:text-white">Modo Roteiro</h3><button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">&times;</button></header>
                <main className="p-6 overflow-y-auto">
                    <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-xl leading-relaxed whitespace-pre-wrap mb-4 h-60 overflow-y-auto">{text}</div>
                    {recordingType === 'video' && (<video ref={videoRef} autoPlay muted className={`w-full rounded-lg bg-black mb-4 ${isRecording || mediaUrl ? 'block' : 'hidden'}`}></video>)}
                    {mediaUrl && (<div className="text-center my-4">{recordingType === 'video' && mediaUrl && <video src={mediaUrl} controls className="w-full rounded-lg mb-2"></video>}{recordingType === 'audio' && <audio src={mediaUrl} controls className="w-full" />}<a href={mediaUrl} download={`convite_${recordingType}.webm`} className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Baixar Gravação</a><p className="text-sm text-slate-500 mt-2">Baixe o arquivo e anexe-o manualmente na sua conversa do WhatsApp.</p></div>)}
                    {error && <p className="text-red-500 text-center my-2">{error}</p>}
                </main>
                <footer className="p-4 border-t dark:border-slate-700 flex justify-center gap-4">{!isRecording ? (<><button onClick={() => startRecording('audio')} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700">Gravar Áudio</button><button onClick={() => startRecording('video')} className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700">Gravar Vídeo</button></>) : (<button onClick={stopRecording} className="bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-slate-600">Parar Gravação</button>)}</footer>
            </div>
        </div>
    );
};


const InviteGenerator = () => {
    const [guestName, setGuestName] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [tone, setTone] = useState('profissional e formal');
    const [generatedResponse, setGeneratedResponse] = useState('O seu convite aparecerá aqui...');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

    const callApi = async (prompt) => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) throw new Error('Falha na resposta da API.');
            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            return 'Ocorreu um erro ao processar o seu pedido. Tente novamente.';
        }
    };

    const handleGenerateClick = async () => {
        if (!guestName || !profileDescription) {
            alert('Por favor, preencha o nome e a descrição do perfil.');
            return;
        }
        setIsLoading(true);
        setGeneratedResponse('');
        const prompt = `Crie um convite curto e direto para WhatsApp, focado em marketing de rede para a "Equipe de Triunfo", em português do Brasil. O texto deve ser breve (no máximo 3 ou 4 frases curtas) e terminar com uma pergunta para incentivar a resposta. O tom do convite deve ser ${tone}. O nome do convidado é ${guestName}. O perfil do convidado é: "${profileDescription}". O objetivo é despertar o interesse para uma apresentação de negócio.`;
        const result = await callApi(prompt);
        setGeneratedResponse(result);
        setIsLoading(false);
    };

    const handleSummarizeClick = async () => {
        if (!generatedResponse || generatedResponse.startsWith('O seu convite')) {
            alert('Não há texto para resumir. Gere um convite primeiro.');
            return;
        }
        setIsSummarizing(true);
        const prompt = `Resuma o seguinte convite de negócios em uma ou duas frases curtas, mantendo o tom original e o idioma em português do Brasil: "${generatedResponse}"`;
        const result = await callApi(prompt);
        setGeneratedResponse(result);
        setIsSummarizing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedResponse);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
    };

    const handleWhatsappShare = () => {
        if (!whatsappNumber) {
            alert('Por favor, insira um número de telefone.');
            return;
        }
        const encodedText = encodeURIComponent(generatedResponse);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    };

    return (
        <>
            <div className="bg-white dark:bg-indigo-900 p-8 rounded-lg shadow-lg space-y-8">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Gerador de Convites com IA</h2>
                 <div className="space-y-6">
                    <div><label htmlFor="guest-name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">1. Nome do Convidado</label><input type="text" id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Digite o nome aqui..." className="w-full bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-900 dark:text-white" /></div>
                    <div><label htmlFor="profile-description" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">2. Descreva o Perfil</label><textarea id="profile-description" value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows="3" placeholder="Ex: 'Colega ambicioso, bom em vendas e que procura uma renda extra.'" className="w-full bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-slate-900 dark:text-white"></textarea></div>
                    <div><label className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">3. Escolha o Tom</label><div className="flex flex-wrap gap-x-6 gap-y-2">{['profissional e formal', 'amigável e informal', 'entusiasmado e energético', 'direto e com senso de urgência', 'inspirador e motivacional'].map(t => (<label key={t} className="flex items-center cursor-pointer"><input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300" /><span className="ml-2 text-md dark:text-slate-300 capitalize">{t.split(' ')[0]}</span></label>))}</div></div>
                    <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-blue-700 active:bg-blue-800 transition duration-200 ease-in-out shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">{isLoading ? (<><div className="loader"></div><span>Gerando...</span></>) : (<> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg> <span>Gerar Convite com IA</span></>)}</button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                     <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold dark:text-slate-200">Resultado</h2><div className="flex gap-2 flex-wrap"><button onClick={() => setIsTeleprompterOpen(true)} className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-teal-700 transition duration-200 ease-in-out flex items-center gap-2">Gravar Roteiro</button><button onClick={handleSummarizeClick} disabled={isSummarizing} className="bg-purple-600 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-purple-700 transition duration-200 ease-in-out flex items-center gap-2 disabled:bg-slate-400">{isSummarizing ? (<><div className="loader"></div><span>Resumindo...</span></>) : ('Resumir')}</button><button onClick={handleCopy} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-1.5 hover:bg-slate-300 dark:hover:bg-slate-600 transition duration-200 ease-in-out">{copyButtonText}</button></div></div>
                     <div className="relative"><textarea id="response-container" value={generatedResponse} readOnly rows="10" className="w-full bg-slate-100 dark:bg-indigo-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-md leading-relaxed text-slate-800 dark:text-slate-200" placeholder="O seu convite aparecerá aqui..."></textarea></div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-slate-200">Compartilhar Texto</h2>
                    <div className="flex flex-col sm:flex-row gap-4"><input type="tel" id="whatsapp-number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Telefone com DDD (ex: 11987654321)" className="flex-grow bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition text-slate-900 dark:text-white" /><button onClick={handleWhatsappShare} className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 active:bg-green-700 transition duration-200 ease-in-out shadow-md flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.42.2.46.2a.38.38 0 0 1 .18.42c-.06.26-.45.9-.56 1.05c-.1.15-.26.2-.4.13c-.15-.06-.6-.26-1.12-.5c-.54-.25-1.04-.58-1.48-.98c-.44-.4-.8-1-.9-1.16c-.1-.18-.04-.28.04-.38c.08-.08.18-.2.25-.26c.08-.08.13-.13.18-.2a.5.5 0 0 0 .04-.42c-.05-.13-.45-1.08-.6-1.48c-.16-.4-.3-.34-.42-.34c-.1-.02-1 .08-1.13.08c-.13 0-.3.03-.45.2c-.15.15-.58.55-.58 1.35s.6 1.58.68 1.7c.08.1.58 1.25 2 2.3c1.4 1.05 2.15 1.25 2.53 1.25c.38 0 .6-.08.7-.28c.1-.2.45-.85.5-1.1c.06-.25.04-.48-.03-.55c-.08-.08-.18-.13-.38-.23zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8z" /></svg><span>WhatsApp</span></button></div>
                </div>
            </div>
            {isTeleprompterOpen && <TeleprompterModal text={generatedResponse} onClose={() => setIsTeleprompterOpen(false)} />}
        </>
    );
};

export default InviteGenerator;

