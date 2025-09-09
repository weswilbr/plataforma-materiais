// NOME DO ARQUIVO: components/InviteGenerator.js
// ATUALIZAÇÃO: O componente TeleprompterModal foi completamente reescrito para
// funcionar como um teleprompter real, com rolagem automática, controlos de
// velocidade, tamanho da fonte e modo espelho.

import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from './icons'; // Importa todos os ícones de um só lugar

// --- Componente Teleprompter ---
const TeleprompterModal = ({ text, onClose }) => {
    // --- Estados para Gravação ---
    const [isRecording, setIsRecording] = useState(false);
    const [recordingType, setRecordingType] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // --- Estados para Teleprompter ---
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1); // Velocidade base
    const [fontSize, setFontSize] = useState(48); // Tamanho da fonte em pixels
    const [isMirrored, setIsMirrored] = useState(false);
    const textContainerRef = useRef(null);
    const animationFrameRef = useRef(null);

    // --- Lógica de Rolagem ---
    const scrollText = useCallback(() => {
        if (textContainerRef.current) {
            textContainerRef.current.scrollTop += scrollSpeed * 0.5;
            animationFrameRef.current = requestAnimationFrame(scrollText);
        }
    }, [scrollSpeed]);

    useEffect(() => {
        if (isScrolling) {
            animationFrameRef.current = requestAnimationFrame(scrollText);
        } else {
            cancelAnimationFrame(animationFrameRef.current);
        }
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isScrolling, scrollText]);
    
    const handleResetScroll = () => {
        if (textContainerRef.current) textContainerRef.current.scrollTop = 0;
    };

    // --- Lógica de Gravação ---
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
            console.error("Erro ao aceder à mídia:", err);
            setError('Não foi possível aceder à câmera/microfone. Verifique as permissões do navegador.');
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
       <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full h-full flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3"><Icons.PresentationIcon /> Modo Roteiro</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full">&times;</button>
                </header>

                <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                    {/* Coluna do Teleprompter */}
                    <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/50 blur-sm z-10 pointer-events-none"></div>
                        <div ref={textContainerRef} className="p-10 overflow-y-scroll scrollbar-hide flex-grow">
                             <p 
                                className={`text-white text-center transition-transform duration-300 ${isMirrored ? 'transform scale-x-[-1]' : ''}`}
                                style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
                            >
                                {text}
                            </p>
                        </div>
                    </div>

                    {/* Coluna da Câmera e Controlos */}
                    <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0">
                        <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                            <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover rounded-lg ${isRecording || mediaUrl ? 'block' : 'hidden'}`}></video>
                             {!isRecording && !mediaUrl && <span className="text-slate-500">A sua câmera aparecerá aqui</span>}
                        </div>
                        {mediaUrl && (
                            <div className="text-center bg-slate-800 p-4 rounded-lg">
                                <a href={mediaUrl} download={`convite_${recordingType}.webm`} className="inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 w-full">Baixar Gravação</a>
                            </div>
                        )}
                        <div className="bg-slate-800 p-4 rounded-lg space-y-4">
                            <h4 className="font-bold text-white">Controlos do Roteiro</h4>
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={() => setIsScrolling(prev => !prev)} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition">
                                    {isScrolling ? <Icons.PauseIcon /> : <Icons.PlayIcon />}
                                </button>
                                <button onClick={handleResetScroll} className="p-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition"><Icons.RewindIcon /></button>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center justify-between">Velocidade: <span>{scrollSpeed.toFixed(1)}x</span></label>
                                <input type="range" min="0.5" max="5" step="0.1" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center justify-between">Tamanho da Fonte: <span>{fontSize}px</span></label>
                                <input type="range" min="24" max="96" step="2" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                             <div className="flex items-center justify-between">
                                 <label htmlFor="mirror-toggle" className="text-sm font-medium text-slate-300 flex items-center gap-2 cursor-pointer"><Icons.FlipHorizontalIcon /> Espelhar Texto</label>
                                 <input type="checkbox" id="mirror-toggle" checked={isMirrored} onChange={() => setIsMirrored(!isMirrored)} className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"/>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg flex justify-center gap-4">
                            {!isRecording ? (
                                <>
                                    <button onClick={() => startRecording('audio')} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 flex items-center gap-2"><Icons.SoundOnIcon/> Áudio</button>
                                    <button onClick={() => startRecording('video')} className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 flex items-center gap-2"><Icons.VideoIcon/> Vídeo</button>
                                </>
                            ) : (
                                <button onClick={stopRecording} className="bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-slate-600">Parar Gravação</button>
                            )}
                        </div>
                         {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    </div>
                </main>
            </div>
        </div>
    );
};


const InviteGenerator = ({ onShare }) => {
    const [guestName, setGuestName] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [tone, setTone] = useState('profissional e formal');
    const [generatedResponse, setGeneratedResponse] = useState('O seu convite aparecerá aqui...');
    const [isLoading, setIsLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
    const [error, setError] = useState('');

    const callApi = async (prompt) => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Falha na resposta da API.');
            }
            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error('Erro ao chamar a API:', error);
            setError(error.message);
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

    const handleSummarizeClick = async () => {
        setError('');
        if (!generatedResponse || generatedResponse.startsWith('O seu convite')) {
            setError('Não há texto para resumir. Gere um convite primeiro.');
            return;
        }
        setIsSummarizing(true);
        const prompt = `Resuma o seguinte convite de negócios em uma ou duas frases curtas, mantendo o tom original e o idioma em português do Brasil: "${generatedResponse}"`;
        const result = await callApi(prompt);
        if (result) {
            setGeneratedResponse(result);
        }
        setIsSummarizing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedResponse);
        setCopyButtonText('Copiado!');
        setTimeout(() => setCopyButtonText('Copiar'), 2000);
    };

    const handleWhatsappShare = () => {
        setError('');
        if (!whatsappNumber) {
            setError('Por favor, insira um número de telefone.');
            return;
        }
        const encodedText = encodeURIComponent(generatedResponse);
        window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedText}`, '_blank');
    };

    return (
        <>
            <div className="bg-white dark:bg-indigo-900 p-8 rounded-lg shadow-lg space-y-8">
                 <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Gerador de Convites com IA</h2>
                 <div className="space-y-6">
                    <div><label htmlFor="guest-name" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">1. Nome do Convidado</label><input type="text" id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Digite o nome aqui..." className="form-input w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label htmlFor="profile-description" className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">2. Descreva o Perfil</label><textarea id="profile-description" value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} rows="3" placeholder="Ex: 'Colega ambicioso, bom em vendas e que procura uma renda extra.'" className="form-textarea w-full bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"></textarea></div>
                    <div><label className="block text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">3. Escolha o Tom</label><div className="flex flex-wrap gap-x-6 gap-y-2">{['profissional e formal', 'amigável e informal', 'entusiasmado e energético', 'direto e com senso de urgência', 'inspirador e motivacional'].map(t => (<label key={t} className="flex items-center cursor-pointer"><input type="radio" name="tone" value={t} checked={tone === t} onChange={(e) => setTone(e.target.value)} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-md dark:text-slate-300 capitalize">{t.split(' ')[0]}</span></label>))}</div></div>
                    {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
                    <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3.5 hover:bg-blue-700 active:bg-blue-800 transition duration-200 ease-in-out shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">{isLoading ? (<><div className="loader"></div><span>A gerar...</span></>) : (<> <Icons.SparklesIcon /> <span>Gerar Convite com IA</span></>)}</button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                     <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-semibold dark:text-slate-200">Resultado</h2><div className="flex gap-2 flex-wrap"><button onClick={() => setIsTeleprompterOpen(true)} className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-teal-700 transition duration-200 ease-in-out flex items-center gap-2"><Icons.PresentationIcon/>Gravar Roteiro</button><button onClick={handleSummarizeClick} disabled={isSummarizing} className="bg-purple-600 text-white font-semibold rounded-lg px-4 py-1.5 hover:bg-purple-700 transition duration-200 ease-in-out flex items-center gap-2 disabled:bg-slate-400">{isSummarizing ? (<><div className="loader"></div><span>A resumir...</span></>) : ('Resumir')}</button><button onClick={handleCopy} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg px-4 py-1.5 hover:bg-slate-300 dark:hover:bg-slate-600 transition duration-200 ease-in-out">{copyButtonText}</button></div></div>
                     <div className="relative"><textarea id="response-container" value={generatedResponse} readOnly rows="10" className="w-full bg-slate-100 dark:bg-indigo-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-md leading-relaxed text-slate-800 dark:text-slate-200" placeholder="O seu convite aparecerá aqui..."></textarea></div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-slate-200">Partilhar Texto</h2>
                    <div className="flex flex-col sm:flex-row gap-4"><input type="tel" id="whatsapp-number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="Telefone com DDD (ex: 11987654321)" className="form-input flex-grow bg-slate-50 dark:bg-indigo-800 border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-green-500" /><button onClick={handleWhatsappShare} className="bg-green-500 text-white font-semibold rounded-lg px-6 py-3 hover:bg-green-600 active:bg-green-700 transition duration-200 ease-in-out shadow-md flex items-center justify-center gap-2"><Icons.WhatsAppIcon /><span>WhatsApp</span></button></div>
                </div>
            </div>
            {isTeleprompterOpen && <TeleprompterModal text={generatedResponse} onClose={() => setIsTeleprompterOpen(false)} />}
        </>
    );
};

export default InviteGenerator;

