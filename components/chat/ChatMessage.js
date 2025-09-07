// NOME DO ARQUIVO: components/chat/ChatMessage.js
// Este componente formata o texto das mensagens do chat,
// suportando Markdown simples, links e quebras de linha.

import React from 'react';

const ChatMessage = ({ text }) => {
    // Função para converter texto com Markdown e links em HTML seguro
    const parseText = (rawText = '') => {
        // Protege contra a injeção de HTML, escapando os caracteres essenciais
        let safeText = rawText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // 1. Converte URLs em links clicáveis
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        safeText = safeText.replace(urlRegex, (url) => {
            const hyperLink = url.startsWith('http') ? url : `https://${url}`;
            return `<a href="${hyperLink}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">${url}</a>`;
        });

        // 2. Formatação Markdown
        // Converte *negrito* para <strong>
        safeText = safeText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        // Converte _itálico_ para <em>
        safeText = safeText.replace(/_(.*?)_/g, '<em>$1</em>');
        // Converte ~rasurado~ para <s>
        safeText = safeText.replace(/~(.*?)~/g, '<s>$1</s>');
        // Converte `código` para <code class="...estilo...">
        safeText = safeText.replace(/`(.*?)`/g, '<code class="bg-indigo-900/50 text-slate-300 px-1.5 py-0.5 rounded-md text-sm">$1</code>');

        // 3. Suporte para quebras de linha (converte \n em <br>)
        safeText = safeText.replace(/\n/g, '<br />');

        return safeText;
    };

    return (
        <div
            className="chat-message text-base break-words prose prose-sm dark:prose-invert prose-p:my-0 prose-strong:text-inherit prose-em:text-inherit"
            dangerouslySetInnerHTML={{ __html: parseText(text) }}
        />
    );
};

export default ChatMessage;

