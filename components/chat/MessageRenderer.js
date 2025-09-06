// NOME DO ARQUIVO: components/chat/MessageRenderer.js
// Versão aprimorada com deteção automática de links e suporte a quebras de linha.

import React from 'react';

const MessageRenderer = ({ text }) => {
    // Função para converter texto simples com markdown em HTML, agora com mais funcionalidades
    const parseMarkdown = (rawText = '') => {
        // 1. Proteção básica para evitar a injeção de HTML
        let formattedText = rawText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // 2. Converte as formatações de markdown
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>'); // *negrito*
        formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>'); // _itálico_
        formattedText = formattedText.replace(/~(.*?)~/g, '<s>$1</s>'); // ~rasurado~
        formattedText = formattedText.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>'); // `código`

        // 3. Converte URLs em links clicáveis
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\bwww\.[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        formattedText = formattedText.replace(urlRegex, (url) => {
            const href = url.startsWith('www.') ? `http://${url}` : url;
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">${url}</a>`;
        });
        
        // 4. Converte quebras de linha (\n) em <br> para serem exibidas no HTML
        formattedText = formattedText.replace(/\n/g, '<br />');

        return formattedText;
    };

    return (
        <div 
            className="prose prose-sm dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} 
        />
    );
};

export default MessageRenderer;

