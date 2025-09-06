// NOME DO ARQUIVO: components/chat/MessageRenderer.js
// Renderiza o texto da mensagem, convertendo uma sintaxe simples de Markdown para HTML.

import React from 'react';

const MessageRenderer = ({ text }) => {
    const formatText = (inputText) => {
        // As substituições são aplicadas numa ordem específica para evitar conflitos.
        let formattedText = inputText
            // Links: [texto](url)
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>')
            // Negrito: *texto* (não pode conter espaços no início/fim e deve ter conteúdo)
            .replace(/\*(\S(?:[^*]*\S)?)\*/g, '<strong>$1</strong>')
            // Itálico: _texto_ (mesma lógica do negrito)
            .replace(/_(\S(?:[^_]*\S)?)_/g, '<em>$1</em>')
            // Riscado: ~texto~ (mesma lógica do negrito)
            .replace(/~(\S(?:[^~]*\S)?)~/g, '<del>$1</del>');

        return formattedText;
    };

    const htmlContent = { __html: formatText(text) };

    // Usa as classes 'prose' do plugin @tailwindcss/typography para um estilo agradável
    // prose-p:my-0 remove margens padrão de parágrafos para mensagens de chat curtas
    // break-words é importante para que textos longos sem espaços quebrem a linha
    return (
        <div
            className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 break-words"
            dangerouslySetInnerHTML={htmlContent}
        />
    );
};

export default MessageRenderer;
