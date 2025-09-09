// NOME DO ARQUIVO: components/Teleprompter.js
// NOVO: Este arquivo contém toda a lógica e a interface do Teleprompter,
// funcionando de forma independente.

import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from './icons';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

// --- Ícones ---
const FullscreenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;
const GalleryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/></svg>;

// --- Sub-componente: Pré-visualização ---
const PreviewModal = ({ preview, onClose }) => {
    const playerRef = useRef(null);
    const handleFullscreen = () => {
        if (playerRef.current?.requestFullscreen) playerRef.current.requestFullscreen();
    };
    if (!preview.url) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                {preview.type === 'video' ? (
                    <video ref={playerRef} src={preview.url} controls autoPlay className="w-full h-full rounded-lg" />
                ) : (
                    <audio src={preview.url} controls autoPlay className="w-full" />
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

// --- Sub-componente: Galeria de Gravações ---
const RecordingsGalleryModal = ({ recordings, onPreview, onSelectForProspect, onDelete, onDeleteAll, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
        <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Minhas Gravações</h3>
                <button onClick={onDeleteAll} className="text-red-400 hover:text-red-300 text-xs font-semibold">APAGAR TUDO</button>
            </header>
            <main className="p-4 overflow-y-auto">
                {recordings.length > 0 ? (
                    <ul className="space-y-2">
                        {recordings.map(rec => (
                            <li key={rec.id} className="bg-slate-700 p-2 rounded-lg flex items-center justify-between">
                                <p className="text-white font-medium text-sm truncate flex-grow mr-2">{rec.name}</p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => onPreview(rec)} className="p-2 text-slate-300 hover:text-white" title="Reproduzir"><Icons.PlayCircleIcon /></button>
                                    <button onClick={() => onSelectForProspect(rec)} className="p-2 text-slate-300 hover:text-white" title="Enviar para Prospecto"><Icons.SendIcon /></button>
                                    <button onClick={() => onDelete(rec.id)} className="p-2 text-red-400 hover:text-red-300" title="Apagar"><Icons.TrashIcon /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-sm text-center py-8">Nenhuma gravação encontrada.</p>
                )}
            </main>
            <footer className="p-4 border-t border-slate-700">
                <button onClick={onClose} className="w-full p-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg">Fechar</button>
            </footer>
        </div>
    </div>
);

// --- Sub-componente: Selecionar Prospecto ---
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

    const filteredProspects = prospects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                <header className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Enviar para Prospecto</h3>
                    <input type="text" placeholder="Pesquisar prospecto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-700 text-white p-2 rounded-lg mt-2 border border-slate-600 focus:ring-blue-500" />
                </header>
                <main className="p-4 overflow-y-auto">
                    {loading ? (
                        <p className="text-slate-400 text-center">A carregar...</p>
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

// --- Componente Principal do Teleprompter ---
const TeleprompterModal = ({ text, onClose }) => {
    // Estados do Teleprompter
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const [fontSize, setFontSize] = useState(48);
    const [isMirrored, setIsMirrored] = useState(false);
    
    // Estados de Gravação
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    
    // Estados da Galeria e Modals
    const [dbInstance, setDbInstance] = useState(null);
    const [savedRecordings, setSavedRecordings] = useState([]);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [preview, setPreview] = useState({ url: null, type: null });
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);

    // Refs
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const textContainerRef = useRef(null);
    const animationFrameRef = useRef(null);

    // --- Lógica do IndexedDB ---
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
        store.getAll().onsuccess = (e) => setSavedRecordings(e.target.result.reverse());
    }, [dbInstance]);

    useEffect(() => {
        if (dbInstance) fetchRecordings();
    }, [dbInstance, fetchRecordings]);

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
    
    // --- Lógica de Gravação ---
    const startRecording = async (type) => {
        setError('');
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
                if (dbInstance) {
                    const transaction = dbInstance.transaction(['recordings'], 'readwrite');
                    const store = transaction.objectStore('recordings');
                    const recording = { blob, type, name: `Gravação-${new Date().toLocaleString('pt-BR').replace(/[/:]/g, '-')}.${type === 'video' ? 'webm' : 'ogg'}`, timestamp: new Date() };
                    store.add(recording).onsuccess = () => fetchRecordings();
                }
            };
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Câmera/microfone não acessível. Verifique as permissões.');
            setCountdown(0);
        }
    };
    
    const triggerCountdown = (type) => {
        if (isRecording) return;
        let count = 3;
        setCountdown(count);
        countdownIntervalRef.current = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(countdownIntervalRef.current);
                setCountdown("VAI!");
                setTimeout(() => {
                    setCountdown(0);
                    startRecording(type);
                }, 1000);
            }
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            streamRef.current?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    };

    // --- Lógica da Galeria ---
    const handlePreview = (rec) => {
        const url = URL.createObjectURL(rec.blob);
        setPreview({ url, type: rec.type });
        setIsPreviewOpen(true);
    };

    const handleSelectForProspect = (rec) => {
        setSelectedRecording(rec);
        setIsProspectModalOpen(true);
        setIsGalleryOpen(false);
    };

    const deleteRecording = (id) => {
        if (!dbInstance) return;
        dbInstance.transaction(['recordings'], 'readwrite').objectStore('recordings').delete(id).onsuccess = () => fetchRecordings();
    };

    const deleteAllRecordings = () => {
        if (!dbInstance || !confirm("Tem a certeza que quer apagar TODAS as gravações?")) return;
        dbInstance.transaction(['recordings'], 'readwrite').objectStore('recordings').clear().onsuccess = () => {
            fetchRecordings();
            setIsGalleryOpen(false);
        };
    };

    const shareRecording = async (prospect, recording) => {
        const file = new File([recording.blob], recording.name, { type: recording.blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try { await navigator.share({ files: [file], title: 'Gravação de Convite', text: `Olá ${prospect.name}, segue uma mensagem para você.` });
            } catch (error) { if (error.name !== 'AbortError') console.error('Erro ao partilhar:', error); }
        } else {
            alert(`Para enviar para ${prospect.name}, baixe o ficheiro e anexe-o na conversa do WhatsApp.`);
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

    // --- Sub-componente Painel de Controlo ---
    const ControlPanel = () => (
        <div className="bg-blue-950/80 backdrop-blur-sm p-3 rounded-lg space-y-3">
            <div className="flex items-center justify-around gap-2 border-b border-slate-700 pb-3">
                <button onClick={() => setIsScrolling(p => !p)} className="p-2 text-white" title={isScrolling ? "Pausar" : "Reproduzir"}>{isScrolling ? <Icons.PauseIcon /> : <Icons.PlayIcon />}</button>
                <button onClick={() => textContainerRef.current.scrollTop=0} className="p-2 text-white" title="Reiniciar"><Icons.RewindIcon /></button>
                <div className="h-6 w-px bg-slate-700"></div>
                {!isRecording ? (
                    <>
                        <button onClick={() => triggerCountdown('audio')} className="p-2 text-white" title="Gravar Áudio"><Icons.SoundOnIcon /></button>
                        <button onClick={() => triggerCountdown('video')} className="p-3 bg-red-600 text-white rounded-full animate-pulse" title="Gravar Vídeo"><Icons.RecIcon /></button>
                    </>
                ) : (
                    <button onClick={stopRecording} className="p-3 bg-red-800 text-white rounded-full" title="Parar Gravação"><Icons.StopIcon /></button>
                )}
                <div className="h-6 w-px bg-slate-700"></div>
                <button onClick={() => setIsGalleryOpen(true)} className="p-2 text-white relative" title="Minhas Gravações">
                    <GalleryIcon />
                    {savedRecordings.length > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-900"></span>}
                </button>
            </div>
            <div className="space-y-2">
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 flex items-center justify-between">Velocidade: <span>{scrollSpeed.toFixed(1)}x</span></label>
                    <input type="range" min="0.5" max="5" step="0.1" value={scrollSpeed} onChange={(e) => setScrollSpeed(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 flex items-center justify-between">Fonte: <span>{fontSize}px</span></label>
                    <input type="range" min="20" max="80" step="2" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                </div>
                <div className="flex items-center justify-between pt-1">
                    <label htmlFor="mirror-toggle" className="text-xs font-medium text-slate-300 flex items-center gap-2 cursor-pointer"><Icons.FlipHorizontalIcon /> Espelhar</label>
                    <input type="checkbox" id="mirror-toggle" checked={isMirrored} onChange={() => setIsMirrored(!isMirrored)} className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"/>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full h-full flex flex-col">
                <header className="flex justify-between items-center p-3 md:p-4 border-b border-slate-700 flex-shrink-0">
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-3"><Icons.PresentationIcon /> Modo Roteiro</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full">&times;</button>
                </header>
                <main className="flex-grow flex flex-col md:flex-row gap-4 p-2 md:p-4 overflow-hidden">
                    <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden relative min-h-0">
                        <div className="flex-grow relative">
                            <video ref={videoRef} autoPlay muted className="absolute inset-0 w-full h-full object-cover"></video>
                            {countdown > 0 && <div className="absolute inset-0 flex items-center justify-center text-white text-9xl font-bold bg-black/50 z-20">{countdown}</div>}
                            {countdown === "VAI!" && <div className="absolute inset-0 flex items-center justify-center text-white text-9xl font-bold bg-black/50 z-20 animate-ping">VAI!</div>}
                            {!isRecording && !streamRef.current && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-slate-400 text-center text-base bg-black/50 p-4 rounded-lg">A sua câmera aparecerá aqui</span>
                                </div>
                            )}
                            <div className="absolute inset-0 flex flex-col pointer-events-none">
                                <div ref={textContainerRef} className="w-full max-w-4xl mx-auto p-4 overflow-y-scroll scrollbar-hide flex-grow relative pointer-events-auto">
                                    <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/70 z-10 pointer-events-none"></div>
                                    <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.5, transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
                                    className={`text-white text-center transition-transform duration-300 backdrop-blur-sm bg-black/30 p-4 rounded-lg`}>
                                        {text}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="md:hidden p-2"><ControlPanel /></div>
                    </div>
                    <div className="w-full md:w-80 flex-col gap-4 flex-shrink-0 md:max-h-full overflow-y-auto hidden md:flex">
                        <ControlPanel />
                         {error && <p className="text-red-400 text-center text-sm p-2 bg-red-900/50 rounded-lg">{error}</p>}
                    </div>
                </main>
            </div>
            {isGalleryOpen && <RecordingsGalleryModal recordings={savedRecordings} onPreview={handlePreview} onSelectForProspect={handleSelectForProspect} onDelete={deleteRecording} onDeleteAll={deleteAllRecordings} onClose={() => setIsGalleryOpen(false)} />}
            {isProspectModalOpen && <ProspectSelectModal onClose={() => setIsProspectModalOpen(false)} onSelect={(prospect) => shareRecording(prospect, selectedRecording)} />}
            {isPreviewOpen && <PreviewModal preview={preview} onClose={() => setIsPreviewOpen(false)} />}
        </div>
    );
};

export default TeleprompterModal;
