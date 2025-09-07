// NOME DO ARQUIVO: components/chat/ChatInput.js
// Versão com o controlo de som movido para o rodapé.

import React, { useState } from 'react';
import { EmojiPicker, SendIcon, AiIcon, SoundOnIcon, SoundOffIcon } from './ChatUI';

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

    const handleEmojiSelect = (emoji) => {
        // Atualiza a mensagem adicionando o emoji selecionado
        const event = { target: { value: newMessage + emoji } };
        onNewMessageChange(event);
        setIsEmojiPickerVisible(false);
    };
    
    return (
        <footer className="p-4 border-t border-slate-200 dark:border-indigo-800 relative flex-shrink-0">
            {isEmojiPickerVisible && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
            
            <div className="flex items-center justify-center gap-6 mb-3">
                <label htmlFor="popups-toggle" className="flex items-center cursor-pointer text-xs text-slate-500 dark:text-slate-400">
                    <input type="checkbox" id="popups-toggle" checked={popupsEnabled} onChange={onPopupsToggle} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"/>
                    <span className="ml-2">Notificações pop-up</span>
                </label>
                <button onClick={onToggleMute} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {isMuted ? <SoundOnIcon /> : <SoundOffIcon />}
                    <span>{isMuted ? 'Som Ativado' : 'Som Mutado'}</span>
                </button>
            </div>

            <form onSubmit={onSendMessage} className="flex items-center gap-3">
                <button type="button" onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)} className="p-2 flex-shrink-0 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-800 transition" title="Inserir Emoji">
                    <EmojiIcon />
                </button>
                <button type="button" onClick={onAiToggle} className={`p-2 flex-shrink-0 rounded-full transition ${isAiSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-indigo-800 text-slate-500 dark:text-slate-300'}`} title="Falar com a IA">
                    <AiIcon />
                </button>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={onNewMessageChange} 
                    placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."} 
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-full focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" 
                    disabled={isLoading} 
                />
                <button type="submit" className="p-2.5 flex-shrink-0 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:bg-slate-400" disabled={isLoading}>
                    <SendIcon />
                </button>
            </form>
        </footer>
    );
};

export default ChatInput;

