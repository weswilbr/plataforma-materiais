// NOME DO ARQUIVO: components/chat/ChatFooter.js
// Este componente renderiza o rodapé do chat, incluindo o formulário de envio de mensagens.

import { useState } from 'react';
import { EmojiPicker } from './ChatUI';
import { SendIcon, AiIcon, EmojiIcon } from './ChatIcons';

const ChatFooter = ({
    newMessage,
    setNewMessage,
    isAiSelected,
    setIsAiSelected,
    isLoading,
    handleSendMessage,
    popupsEnabled,
    setPopupsEnabled,
}) => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const handleEmojiSelect = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setIsEmojiPickerVisible(false);
    };

    return (
        <footer className="p-4 border-t border-slate-200 dark:border-indigo-800 relative flex-shrink-0">
            {isEmojiPickerVisible && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
            <div className="flex items-center justify-center mb-2">
                <label htmlFor="popups-toggle" className="flex items-center cursor-pointer text-xs text-slate-500 dark:text-slate-400">
                    <input
                        type="checkbox"
                        id="popups-toggle"
                        checked={popupsEnabled}
                        onChange={() => setPopupsEnabled(!popupsEnabled)}
                        className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                    />
                    <span className="ml-2">Notificações pop-up</span>
                </label>
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-800 transition flex-shrink-0"
                    title="Inserir Emoji"
                    aria-label="Inserir Emoji"
                >
                    <EmojiIcon />
                </button>
                <button
                    type="button"
                    onClick={() => setIsAiSelected(!isAiSelected)}
                    className={`p-2 rounded-full transition flex-shrink-0 ${isAiSelected ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-indigo-800 text-slate-500 dark:text-slate-300'}`}
                    title="Falar com a IA"
                    aria-label="Ativar modo de conversa com Inteligência Artificial"
                >
                    <AiIcon />
                </button>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={isAiSelected ? "Pergunte algo para a IA..." : "Digite sua mensagem..."}
                    className="flex-1 w-full px-4 py-2 bg-slate-50 dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-full focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="p-2.5 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition disabled:bg-slate-400 flex-shrink-0"
                    disabled={isLoading}
                    aria-label="Enviar mensagem"
                >
                    <SendIcon />
                </button>
            </form>
        </footer>
    );
};

export default ChatFooter;

