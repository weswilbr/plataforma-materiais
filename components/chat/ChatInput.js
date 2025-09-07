// NOME DO ARQUIVO: components/chat/ChatInput.js
// Versão com rodapé redesenhado para melhor usabilidade, especialmente em dispositivos móveis.
// As ações secundárias foram agrupadas num menu pop-up para uma interface mais limpa.

import React, { useState } from 'react';
import { 
    EmojiPicker, 
    PaperAirplaneIcon,
    AiIcon, 
    EmojiIcon, 
    SoundOnIcon, 
    SoundOffIcon,
    PlusCircleIcon 
} from './ChatUI';

/**
 * Menu de Ações que agrupa opções secundárias como Emojis, IA e configurações.
 */
const ActionsMenu = ({ 
    isAiSelected, onAiToggle, 
    popupsEnabled, onPopupsToggle,
    isMuted, onToggleMute,
    onEmojiButtonClick
}) => (
    <div className="absolute bottom-20 left-2 md:left-4 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-xl border dark:border-slate-600 w-60 z-20 animate-fade-in">
        <ul className="space-y-1">
            <li>
                <button onClick={onEmojiButtonClick} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition text-slate-700 dark:text-slate-300">
                    <EmojiIcon />
                    <span>Inserir Emoji</span>
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
    const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

    const handleEmojiSelect = (emoji) => {
        const event = { target: { value: newMessage + emoji } };
        onNewMessageChange(event);
        setIsEmojiPickerVisible(false);
    };

    const toggleEmojiPicker = () => {
        setIsActionsMenuOpen(false); // Fecha o menu de ações ao abrir o de emojis
        setIsEmojiPickerVisible(!isEmojiPickerVisible);
    };

    const toggleActionsMenu = () => {
        setIsEmojiPickerVisible(false); // Fecha o de emojis ao abrir o menu de ações
        setIsActionsMenuOpen(!isActionsMenuOpen);
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
                    onEmojiButtonClick={toggleEmojiPicker}
                />
            )}
            {isEmojiPickerVisible && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
            
            <form onSubmit={onSendMessage} className="flex items-center gap-2">
                {/* Botão de Ações (+) */}
                <button 
                    type="button" 
                    onClick={toggleActionsMenu} 
                    className="p-2 flex-shrink-0 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-800 transition" 
                    title="Mais Ações"
                >
                    <PlusCircleIcon />
                </button>
                
                {/* Campo de Input */}
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={onNewMessageChange} 
                        placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."} 
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-indigo-800 border border-transparent focus:ring-2 focus:ring-blue-500 rounded-full text-slate-900 dark:text-white transition-all duration-300"
                        disabled={isLoading}
                        onFocus={() => {
                            setIsActionsMenuOpen(false);
                            setIsEmojiPickerVisible(false);
                        }}
                    />
                     {isAiSelected && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs font-bold px-2 py-0.5 rounded-full pointer-events-none">
                            <AiIcon />
                            <span>IA</span>
                        </div>
                    )}
                </div>

                {/* Botão de Envio */}
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

