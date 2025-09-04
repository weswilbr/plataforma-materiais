// NOME DO ARQUIVO: pages/api/generate.js
// Serverless Function que a Vercel irá executar.

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
        return response.status(500).json({ error: 'A chave da API não está configurada no servidor' });
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
            console.error('Erro da API do Gemini:', errorBody);
            throw new Error(errorBody.error.message);
        }

        const data = await geminiResponse.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
             return response.status(500).json({ error: 'Resposta inválida da API do Gemini' });
        }

        return response.status(200).json({ text: text });

    } catch (error) {
        console.error('Erro interno do servidor:', error);
        return response.status(500).json({ error: error.message || 'Um erro inesperado aconteceu' });
    }
}

