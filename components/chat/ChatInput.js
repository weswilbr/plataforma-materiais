// NOME DO ARQUIVO: components/chat/ChatInput.js
// APRIMORAMENTO: Redesign da barra de input para acesso mais rápido a emojis.
// Adicionada a funcionalidade de anexo de arquivos no menu de ações.

import React, { useState, useRef } from 'react';
import { 
    EmojiPicker, 
    PaperAirplaneIcon,
    AiIcon, 
    EmojiIcon, 
    SoundOnIcon, 
    SoundOffIcon,
    PlusCircleIcon,
    PaperclipIcon
} from './ChatUI';

/**
 * Menu de Ações que agrupa opções secundárias.
 */
const ActionsMenu = ({ 
    isAiSelected, onAiToggle, 
    popupsEnabled, onPopupsToggle,
    isMuted, onToggleMute,
    onFileUploadClick
}) => (
    <div className="absolute bottom-16 left-2 md:left-4 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-xl border dark:border-slate-600 w-60 z-20 animate-fade-in">
        <ul className="space-y-1">
            <li>
                <button onClick={onFileUploadClick} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition text-slate-700 dark:text-slate-300">
                    <PaperclipIcon />
                    <span>Anexar Arquivo</span>
                </button>
            </li>
            <li>
                <button onClick={onAiToggle} className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition ${isAiSelected ? 'text-cyan-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    <AiIcon />
                    <span>{isAiSelected ? 'Falar com Pessoas' : 'Perguntar à IA'}</span>
                </button>
            </li>
            <li>
                 <label htmlFor="popups-toggle-menu" className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="checkbox" id="popups-toggle-menu" checked={popupsEnabled} onChange={onPopupsToggle} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"/>
                    <span>Alertas pop-up</span>
                </label>
            </li>
            <li>
                 <button onClick={onToggleMute} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition text-slate-700 dark:text-slate-300">
                    {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                    <span>{isMuted ? 'Ativar Som' : 'Silenciar'}</span>
                </button>
            </li>
        </ul>
    </div>
);


const ChatInput = ({
    newMessage, onNewMessageChange, onSendMessage,
    isAiSelected, onAiToggle, isLoading,
    popupsEnabled, onPopupsToggle, isMuted, onToggleMute,
}) => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleEmojiSelect = (emoji) => {
        const event = { target: { value: newMessage + emoji } };
        onNewMessageChange(event);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Arquivo selecionado:", file.name);
            // Lógica de upload seria chamada aqui. Ex: onFileUpload(file);
        }
    };
    
    return (
        <footer className="p-3 md:p-4 border-t border-slate-200 dark:border-indigo-800 relative flex-shrink-0 bg-white dark:bg-indigo-900">
            {isActionsMenuOpen && (
                <ActionsMenu
                    isAiSelected={isAiSelected}
                    onAiToggle={() => { onAiToggle(); setIsActionsMenuOpen(false); }}
                    popupsEnabled={popupsEnabled}
                    onPopupsToggle={onPopupsToggle}
                    isMuted={isMuted}
                    onToggleMute={onToggleMute}
                    onFileUploadClick={() => { fileInputRef.current.click(); setIsActionsMenuOpen(false); }}
                />
            )}
            {isEmojiPickerVisible && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
            
            <form onSubmit={onSendMessage} className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                <button 
                    type="button" 
                    onClick={() => { setIsActionsMenuOpen(!isActionsMenuOpen); setIsEmojiPickerVisible(false); }} 
                    className="p-2 flex-shrink-0 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-800 transition" 
                    title="Mais Ações"
                >
                    <PlusCircleIcon />
                </button>
                
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={onNewMessageChange} 
                        placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."} 
                        className="w-full px-4 pr-12 py-2.5 bg-slate-100 dark:bg-indigo-800 border border-transparent focus:ring-2 focus:ring-blue-500 rounded-full text-slate-900 dark:text-white transition-all duration-300"
                        disabled={isLoading}
                        onFocus={() => { setIsActionsMenuOpen(false); setIsEmojiPickerVisible(false); }}
                    />
                     <button 
                        type="button" 
                        onClick={() => { setIsEmojiPickerVisible(!isEmojiPickerVisible); setIsActionsMenuOpen(false); }} 
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700"
                        title="Inserir Emoji"
                    >
                        <EmojiIcon />
                    </button>
                </div>

                <button 
                    type="submit" 
                    className="p-2.5 w-11 h-11 flex items-center justify-center flex-shrink-0 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed transform active:scale-90" 
                    disabled={isLoading || newMessage.trim() === ''}
                    title="Enviar Mensagem"
                >
                    {isLoading ? <div className="loader"></div> : <PaperAirplaneIcon />}
                </button>
            </form>
        </footer>
    );
};

export default ChatInput;