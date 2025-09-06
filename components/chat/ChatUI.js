// NOME DO ARQUIVO: components/chat/ChatUI.js
// Contém os sub-componentes visuais utilizados pelo chat.

import React from 'react';

// --- Sub-componente para o seletor de emojis ---
export const EmojiPicker = ({ onEmojiSelect }) => {
    const emojis = ['😀', '😂', '😍', '🤔', '👍', '🙏', '🔥', '🚀', '🎉', '❤️', '👏', '💡'];
    return (
        <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-700 p-2 rounded-lg shadow-xl border dark:border-slate-600">
            <div className="grid grid-cols-6 gap-2">
                {emojis.map(emoji => (
                    <button 
                        key={emoji} 
                        onClick={() => onEmojiSelect(emoji)}
                        className="text-2xl p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};
