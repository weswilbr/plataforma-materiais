// NOME DO ARQUIVO: components/chat/ChatMessage.js
// Este novo componente formata o texto das mensagens do chat.

import React from 'react';

const ChatMessage = ({ text }) => {
    // Função para converter texto simples com markdown em HTML
    const parseMarkdown = (rawText) => {
        // Proteção básica para evitar a injeção de HTML
        let formattedText = rawText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Converte *negrito* para <strong>
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        // Converte _itálico_ para <em>
        formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');
        // Converte ~rasurado~ para <s>
        formattedText = formattedText.replace(/~(.*?)~/g, '<s>$1</s>');
        // Converte `código` para <code>
        formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');

        return formattedText;
    };

    return (
        <div 
            className="chat-message text-base break-words"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} 
        />
    );
};

export default ChatMessage;