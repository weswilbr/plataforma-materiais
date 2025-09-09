// NOME DO ARQUIVO: components/InviteGenerator.js
// ATUALIZAÇÃO: A interface do teleprompter foi otimizada para dispositivos móveis,
// com controlos mais compactos e uma nova janela de pré-visualização em tela cheia.

import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from './icons'; // Importa todos os ícones de um só lugar
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// --- Ícone para a nova funcionalidade ---
const FullscreenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;


// --- Componente para Pré-visualização ---
const PreviewModal = ({ preview, onClose }) => {
    const playerRef = useRef(null);

    const handleFullscreen = () => {
        if (playerRef.current && playerRef.current.requestFullscreen) {
            playerRef.current.requestFullscreen();
        }
    };

    if (!preview.url) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                {preview.type === 'video' ? (
                    <video ref={playerRef} src={preview.url} controls autoPlay className="w-full h-full rounded-lg"></video>
                ) : (
                    <div className="w-full flex items-center">
                        <audio src={preview.url} controls autoPlay className="w-full"></audio>
                    </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                    {preview.type === 'video' && (
                         <button onClick={handleFullscreen} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-white" title="Tela Cheia">
                            <FullscreenIcon />
                        </button>
                    )}
                    <button onClick={onClose} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-white" title="Fechar">
                        <Icons.CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Componente para Selecionar Prospecto ---
const ProspectSelectModal = ({ onSelect, onClose }) => {
    const { user } = useAuth();
    const [prospects, setProspects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, `users/${user.uid}/prospects`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProspects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const filteredProspects = prospects.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                <header className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Enviar para Prospecto</h3>
                    <input 
                        type="text"
                        placeholder="Pesquisar prospecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-700 text-white p-2 rounded-lg mt-2 border border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                </header>
                <main className="p-4 overflow-y-auto">
                    {loading ? (
                        <p className="text-slate-400 text-center">A carregar prospectos...</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredProspects.map(prospect => (
                                <li key={prospect.id}>
                                    <button onClick={() => onSelect(prospect)} className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex justify-between items-center transition">
                                        <span className="font-medium text-white">{prospect.name}</span>
                                        <span className="text-sm text-slate-400">{prospect.whatsapp}</span>
                                    </button>
                                </li>
                            ))}
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

// --- Componente Teleprompter ---
const TeleprompterModal = ({ text, onClose }) => {
    // --- Estados para Gravação ---
    const [isRecording, setIsRecording] = useState(false);
    const [recordingType, setRecordingType] = useState(null);
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    
    // --- Estados para Galeria ---
    const [dbInstance, setDbInstance] = useState(null);
    const [savedRecordings, setSavedRecordings] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const [preview, setPreview] = useState({ url: null, type: null });
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    // --- Estados para Teleprompter ---
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [fontSize, setFontSize] = useState(48);
    const [isMirrored, setIsMirrored] = useState(false);
    const textContainerRef = useRef(null);
    const animationFrameRef = useRef(null);

    // --- Inicialização do IndexedDB ---
    useEffect(() => {
        const request = indexedDB.open("teleprompterDB", 1);
        request.onerror = (event) => console.error("Erro no IndexedDB:", event);
        request.onsuccess = (event) => setDbInstance(event.target.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('recordings')) {
                db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
            }
        };
    }, []);

    const fetchRecordings = useCallback(() => {
        if (!dbInstance) return;
        const transaction = dbInstance.transaction(['recordings'], 'readonly');
        const store = transaction.objectStore('recordings');
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => setSavedRecordings(getAllRequest.result.reverse());
    }, [dbInstance]);

    useEffect(() => {
        fetchRecordings();
    }, [fetchRecordings]);

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
    
    // --- Lógica de Gravação e Galeria ---
    const saveRecording = (blob, type) => {
        if (!dbInstance) return;
        const transaction = dbInstance.transaction(['recordings'], 'readwrite');
        const store = transaction.objectStore('recordings');
        const recording = {
            blob,
            type,
            name: `Gravação-${new Date().toLocaleString('pt-BR').replace(/[/:]/g, '-')}.${type === 'video' ? 'webm' : 'ogg'}`,
            timestamp: new Date()
        };
        store.add(recording).onsuccess = () => fetchRecordings();
    };

    const deleteRecording = (id) => {
        if (!dbInstance) return;
        const transaction = dbInstance.transaction(['recordings'], 'readwrite');
        transaction.objectStore('recordings').delete(id).onsuccess = () => {
            fetchRecordings();
        };
    };

    const deleteAllRecordings = () => {
        if (!dbInstance || !confirm("Tem a certeza que quer apagar TODAS as gravações?")) return;
        const transaction = dbInstance.transaction(['recordings'], 'readwrite');
        transaction.objectStore('recordings').clear().onsuccess = () => {
            fetchRecordings();
        };
    };
    
    const startRecording = async (type) => {
        setError('');
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            const chunks = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: type === 'video' ? 'video/webm' : 'audio/ogg' });
                saveRecording(blob, type);
            };
            recorder.start();
            setIsRecording(true);
            setRecordingType(type);
        } catch (err) {
            setError('Não foi possível aceder à câmera/microfone. Verifique as permissões.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            streamRef.current?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    };
    
    const handlePreview = (rec) => {
        const url = URL.createObjectURL(rec.blob);
        setPreview({ url, type: rec.type });
        setIsPreviewModalOpen(true);
    };

    const shareRecording = async (prospect, recording) => {
        const file = new File([recording.blob], recording.name, { type: recording.blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Gravação de Convite',
                    text: `Olá ${prospect.name}, segue uma mensagem para você.`,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Erro ao partilhar:', error);
                }
            }
        } else {
            alert(`Para enviar para ${prospect.name}, por favor, baixe o ficheiro e anexe-o na conversa do WhatsApp.`);
            const url = URL.createObjectURL(recording.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = recording.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setIsProspectModalOpen(false);
    };

    return (
       <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full h-full flex flex-col">
                <header className="flex justify-between items-center p-3 md:p-4 border-b border-slate-700 flex-shrink-0">
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3"><Icons.PresentationIcon /> Modo Roteiro</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full">&times;</button>
                </header>
                <main className="flex-grow flex flex-col md:flex-row gap-2 md:gap-4 p-2 md:p-4 overflow-hidden">
                    {/* Coluna Principal: Vídeo com sobreposição de texto */}
                    <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden relative min-h-[40vh] md:min-h-0">
                        <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover"></video>
                        {!isRecording && !streamRef.current && (
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-slate-400 text-center text-base md:text-lg bg-black/50 p-4 rounded-lg">A sua câmera aparecerá aqui</span>
                             </div>
                        )}
                        <div className="absolute inset-0 flex flex-col pointer-events-none">
                            <div ref={textContainerRef} className="w-full max-w-4xl mx-auto p-4 md:p-10 overflow-y-scroll scrollbar-hide flex-grow relative pointer-events-auto">
                                <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/70 z-10 pointer-events-none"></div>
                                <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.5, transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
                                   className={`text-white text-center transition-transform duration-300 backdrop-blur-sm bg-black/30 p-4 rounded-lg`}>
                                    {text}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Coluna de Controlos e Galeria */}
                    <div className="w-full md:w-80 flex flex-col gap-2 md:gap-4 flex-shrink-0 md:max-h-full overflow-y-auto">
                        
                        {/* Controlos do Roteiro */}
                        <div className="bg-slate-800 p-3 rounded-lg space-y-2">
                            <h4 className="font-bold text-white text-base">Controlos do Roteiro</h4>
                            <div className="flex items-center justify-center gap-4">
                                <button onClick={() => setIsScrolling(p => !p)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition">
                                    {isScrolling ? <Icons.PauseIcon /> : <Icons.PlayIcon />}
                                </button>
                                <button onClick={handleResetScroll} className="p-2 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition"><Icons.RewindIcon /></button>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">Velocidade: <span>{scrollSpeed.toFixed(1)}x</span></label>
                                <input type="range" min="0.5" max="5" step="0.1" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">Tamanho da Fonte: <span>{fontSize}px</span></label>
                                <input type="range" min="20" max="80" step="2" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="mirror-toggle" className="text-xs font-medium text-slate-300 flex items-center gap-2 cursor-pointer"><Icons.FlipHorizontalIcon /> Espelhar Texto</label>
                                <input type="checkbox" id="mirror-toggle" checked={isMirrored} onChange={() => setIsMirrored(!isMirrored)} className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"/>
                            </div>
                        </div>

                        {/* Controlos de Gravação */}
                        <div className="bg-slate-800 p-3 rounded-lg flex justify-center gap-4">
                           {!isRecording ? (
                                <>
                                    <button onClick={() => startRecording('audio')} className="bg-blue-600 text-white font-semibold py-2 px-3 text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"><Icons.SoundOnIcon/> Áudio</button>
                                    <button onClick={() => startRecording('video')} className="bg-red-600 text-white font-semibold py-2 px-3 text-sm rounded-lg hover:bg-red-700 flex items-center gap-2"><Icons.VideoIcon/> Vídeo</button>
                                </>
                            ) : (
                                <button onClick={stopRecording} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2"><Icons.StopIcon/> Parar</button>
                            )}
                        </div>
                        
                        {/* Galeria de Gravações */}
                        <div className="bg-slate-800 p-3 rounded-lg flex flex-col flex-grow min-h-0">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-white text-base">Minhas Gravações</h4>
                                <button onClick={deleteAllRecordings} className="text-red-400 hover:text-red-300 text-xs font-semibold">REINICIAR</button>
                            </div>
                            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                                {savedRecordings.length > 0 ? savedRecordings.map(rec => (
                                    <div key={rec.id} className="bg-slate-700 p-2 rounded-lg flex items-center justify-between">
                                        <div className="flex-grow overflow-hidden mr-2">
                                            <p className="text-white font-medium text-sm truncate">{rec.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => handlePreview(rec)} className="p-2 text-slate-300 hover:text-white"><Icons.PlayCircleIcon /></button>
                                            <button onClick={() => { setSelectedRecording(rec); setIsProspectModalOpen(true); }} className="p-2 text-slate-300 hover:text-white"><Icons.SendIcon /></button>
                                            <button onClick={() => deleteRecording(rec.id)} className="p-2 text-red-400 hover:text-red-300"><Icons.TrashIcon /></button>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-500 text-sm text-center pt-8">Nenhuma gravação encontrada.</p>}
                            </div>
                        </div>
                         {error && <p className="text-red-400 text-center text-sm p-2 bg-red-900/50 rounded-lg">{error}</p>}
                    </div>
                </main>
            </div>
            {isProspectModalOpen && (
                <ProspectSelectModal 
                    onClose={() => setIsProspectModalOpen(false)}
                    onSelect={(prospect) => shareRecording(prospect, selectedRecording)}
                />
            )}
            {isPreviewModalOpen && <PreviewModal preview={preview} onClose={() => setIsPreviewModalOpen(false)} />}
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

