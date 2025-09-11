// NOME DO ARQUIVO: components/chat/ChatMessage.js
// APRIMORAMENTO: Componente otimizado com React.useMemo para performance.
// Adicionado suporte para blockquotes (>), encurtamento de links longos para melhor UX,
// e estilos de tema claro/escuro para blocos de código.

import React, { useMemo } from 'react';

const ChatMessage = ({ text }) => {

    // useMemo garante que o parsing complexo só seja executado quando o texto da mensagem mudar.
    const parsedHtml = useMemo(() => {
        if (!text) return '';

        // 1. Protege contra a injeção de HTML, escapando os caracteres essenciais
        let safeText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // 2. Converte blockquotes (linhas que começam com '>') antes de outras formatações
        // A flag 'gm' é para 'global' e 'multiline'
        safeText = safeText.replace(/^(?:&gt;|\>)( .*\n?)/gm, '<blockquote class="border-l-4 border-slate-300 dark:border-slate-500 pl-3 text-slate-500 dark:text-slate-400 italic my-2">$1</blockquote>');

        // 3. Converte URLs em links clicáveis com encurtamento visual
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        safeText = safeText.replace(urlRegex, (url) => {
            const displayUrl = url.length > 40 ? url.slice(0, 37) + '...' : url;
            const hyperLink = url.startsWith('http') ? url : `https://${url}`;
            return `<a href="${hyperLink}" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 hover:underline" title="${url}">${displayUrl}</a>`;
        });

        // 4. Formatação Markdown Inline
        // Converte *negrito* para <strong>
        safeText = safeText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        // Converte _itálico_ para <em>
        safeText = safeText.replace(/_(.*?)_/g, '<em>$1</em>');
        // Converte ~rasurado~ para <s>
        safeText = safeText.replace(/~(.*?)~/g, '<s>$1</s>');
        // Converte `código` para <code /> com estilos para ambos os temas
        safeText = safeText.replace(/`(.*?)`/g, '<code class="bg-slate-200 text-slate-700 dark:bg-indigo-900/50 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>');

        // 5. Suporte para quebras de linha (converte \n em <br>) - geralmente o último passo
        safeText = safeText.replace(/\n/g, '<br />');

        return safeText;
    }, [text]); // A dependência é apenas o 'text'

    return (
        <div
            className="chat-message text-base break-words prose prose-sm max-w-none dark:prose-invert prose-p:my-0 prose-strong:text-inherit prose-em:text-inherit prose-blockquote:my-0"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
        />
    );
};

export default ChatMessage;