// NOME DO ARQUIVO: components/chat/MessageRenderer.js
// APRIMORAMENTO: Componente otimizado com React.useMemo para performance.
// Adicionado suporte para blockquotes (>), listas (-), encurtamento de links longos
// e estilos de tema claro/escuro para blocos de código.

import React, { useMemo } from 'react';

const MessageRenderer = ({ text }) => {

    // useMemo garante que o parsing complexo só seja executado quando o texto da mensagem mudar.
    const parsedHtml = useMemo(() => {
        if (!text) return '';

        // 1. Protege contra a injeção de HTML, escapando os caracteres essenciais.
        // A tag de blockquote é a única exceção que trataremos antes.
        let safeText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Array de regras de parsing para organização e ordem de prioridade
        const parsingRules = [
            // Blockquotes (linhas que começam com '>') - deve ser um dos primeiros
            {
                regex: /^(?:&gt;|\>)( .*\n?)/gm,
                replacement: '<blockquote class="border-l-4 border-slate-300 dark:border-slate-500 pl-3 text-slate-500 dark:text-slate-400 italic my-2">$1</blockquote>'
            },
            // URLs com encurtamento visual
            {
                regex: /(https?:\/\/[^\s]+|www\.[^\s]+)/g,
                replacement: (url) => {
                    const displayUrl = url.length > 40 ? url.slice(0, 37) + '...' : url;
                    const hyperLink = url.startsWith('http') ? url : `https://${url}`;
                    return `<a href="${hyperLink}" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 hover:underline" title="${url}">${displayUrl}</a>`;
                }
            },
            // Listas não ordenadas (linhas que começam com '-' ou '*')
            {
                regex: /^(?:-|\*)( .*\n?)/gm,
                replacement: '<ul class="list-disc list-inside my-1"><li>$1</li></ul>'
            },
            // Markdown inline: Negrito
            { regex: /\*(.*?)\*/g, replacement: '<strong>$1</strong>' },
            // Itálico
            { regex: /_(.*?)_/g, replacement: '<em>$1</em>' },
            // Rasurado
            { regex: /~(.*?)~/g, replacement: '<s>$1</s>' },
            // Código com estilos para ambos os temas
            {
                regex: /`(.*?)`/g,
                replacement: '<code class="bg-slate-200 text-slate-700 dark:bg-indigo-900/50 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>'
            },
        ];

        // Aplica todas as regras
        let processedText = parsingRules.reduce((currentText, rule) => {
            return currentText.replace(rule.regex, rule.replacement);
        }, safeText);
        
        // Limpa listas múltiplas criadas pelo regex
        processedText = processedText.replace(/<\/ul>\s*<ul[^>]*>/g, '');

        // Suporte para quebras de linha (converte \n em <br>) - deve ser o último
        processedText = processedText.replace(/\n/g, '<br />');

        return processedText;
    }, [text]); // A dependência é apenas o 'text'

    return (
        <div
            className="chat-message text-base break-words prose prose-sm max-w-none dark:prose-invert prose-p:my-0 prose-strong:text-inherit prose-em:text-inherit prose-blockquote:my-0 prose-ul:my-0 prose-li:my-0"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
        />
    );
};

export default MessageRenderer;