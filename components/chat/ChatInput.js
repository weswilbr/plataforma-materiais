// NOME DO ARQUIVO: components/chat/ChatInput.js
// Versão aprimorada com UI mais limpa, menu de ações e campo de texto dinâmico.

import React, { useState, useRef, useEffect } from 'react';
import { EmojiPicker, AiIcon, EmojiIcon, SoundOnIcon, SoundOffIcon, PlusCircleIcon, PaperAirplaneIcon } from './ChatUI';

const ChatInput = ({
    newMessage,
    onNewMessageChange,
    onSendMessage,
    isAiSelected,
    onAiToggle,
    isLoading,
    popupsEnabled,
    onPopupsToggle,
    isMuted,
    onToggleMute,
}) => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [isActionsMenuVisible, setIsActionsMenuVisible] = useState(false);
    const textareaRef = useRef(null);

    // Efeito para ajustar a altura da textarea dinamicamente
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [newMessage]);

    const handleEmojiSelect = (emoji) => {
        // Simula um evento de 'change' para que o hook useChatManager o possa processar
        const event = { target: { value: newMessage + emoji } };
        onNewMessageChange(event);
        setIsEmojiPickerVisible(false);
    };
    
    return (
        <footer className="p-3 border-t border-slate-200 dark:border-indigo-800 relative flex-shrink-0">
            {isEmojiPickerVisible && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
            
            <form onSubmit={onSendMessage} className="flex items-end gap-2">
                {/* Botão de Ações e Menu Pop-up */}
                <div className="relative">
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsActionsMenuVisible(!isActionsMenuVisible);
                            setIsEmojiPickerVisible(false);
                        }}
                        className={`p-2 flex-shrink-0 rounded-full transition-colors duration-200 ${isAiSelected ? 'text-cyan-500' : 'text-slate-500 dark:text-slate-400'} hover:bg-slate-200 dark:hover:bg-indigo-800`} 
                        title="Mais ações"
                    >
                        <PlusCircleIcon />
                    </button>
                    {isActionsMenuVisible && (
                        <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-700 p-2 rounded-xl shadow-2xl border dark:border-slate-600 flex flex-col gap-1 w-60">
                           <button type="button" onClick={() => { setIsEmojiPickerVisible(!isEmojiPickerVisible); setIsActionsMenuVisible(false); }} className="flex items-center gap-3 text-left w-full p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                <EmojiIcon />
                                <span>Inserir Emoji</span>
                            </button>
                            <button type="button" onClick={onAiToggle} className={`flex items-center gap-3 text-left w-full p-2 rounded-lg transition-colors ${isAiSelected ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                                <AiIcon />
                                <span>{isAiSelected ? 'Modo IA Ativado' : 'Falar com IA'}</span>
                            </button>
                            <div className="border-t border-slate-200 dark:border-slate-600 my-1"></div>
                             <label htmlFor="popups-toggle" className="flex items-center gap-3 w-full p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                                <input type="checkbox" id="popups-toggle" checked={popupsEnabled} onChange={onPopupsToggle} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"/>
                                <span>Notificações pop-up</span>
                            </label>
                            <button type="button" onClick={onToggleMute} className="flex items-center gap-3 text-left w-full p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                                {isMuted ? <SoundOnIcon /> : <SoundOffIcon />}
                                <span>{isMuted ? 'Ativar Som' : 'Mutar Som'}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Campo de Texto e Botão de Enviar */}
                <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-indigo-800/50 rounded-2xl">
                    <textarea 
                        ref={textareaRef}
                        rows="1"
                        value={newMessage} 
                        onChange={onNewMessageChange} 
                        placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."} 
                        className={`w-full p-2.5 px-4 pr-12 bg-transparent resize-none border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none text-slate-900 dark:text-white transition-colors max-h-32`}
                        disabled={isLoading} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSendMessage(e);
                            }
                        }}
                    />
                     {newMessage.trim() && (
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 flex-shrink-0 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={isLoading}>
                            <PaperAirplaneIcon />
                        </button>
                    )}
                </div>
            </form>
        </footer>
    );
};

export default ChatInput;

