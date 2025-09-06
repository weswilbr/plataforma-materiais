// NOME DO ARQUIVO: pages/api/generate.js
// Versão com tratamento de erros melhorado para fornecer mais detalhes ao cliente.

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Método não permitido' });
    }

    const { prompt } = request.body;
    if (!prompt) {
        return response.status(400).json({ error: 'O prompt é obrigatório' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'A chave da API (GEMINI_API_KEY) não está configurada no servidor. Por favor, adicione-a nas variáveis de ambiente do seu projeto na Vercel.' });
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            const errorMessage = errorBody?.error?.message || 'A API do Gemini retornou um erro desconhecido.';
            console.error('Erro da API do Gemini:', errorBody);
            // Retorna uma mensagem de erro mais específica para o frontend.
            return response.status(500).json({ error: `Erro na API de IA: ${errorMessage}` });
        }

        const data = await geminiResponse.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
             return response.status(500).json({ error: 'Resposta inválida da API do Gemini. O texto gerado está vazio.' });
        }

        return response.status(200).json({ text: text });

    } catch (error) {
        console.error('Erro interno do servidor:', error);
        return response.status(500).json({ error: error.message || 'Um erro inesperado aconteceu no servidor.' });
    }
}

