// NOME DO ARQUIVO: pages/api/generate.js
// ATUALIZAÇÃO: Adicionado um prompt de sistema para guiar a IA e melhorado o tratamento de erros.

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
        console.error("A chave da API (GEMINI_API_KEY) não está configurada.");
        return response.status(500).json({ error: 'Erro de configuração no servidor.' });
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // REFACTOR: Adicionado um prompt de sistema para dar contexto e regras à IA.
    const systemPrompt = `Você é um assistente da "Equipe de Triunfo", especialista em marketing de rede e nos produtos da 4Life. Seja sempre profissional, objetivo e prestativo. As suas respostas devem ser diretas e focadas em ajudar o utilizador com o seu negócio 4Life. Nunca saia deste tópico.`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        }
    };

    try {
        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            console.error('Erro da API Gemini:', errorBody);
            const errorMessage = errorBody?.error?.message || 'A API de IA retornou um erro.';
            return response.status(geminiResponse.status).json({ error: `Falha na comunicação com a IA: ${errorMessage}` });
        }

        const data = await geminiResponse.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
             return response.status(500).json({ error: 'Resposta inválida da API. O texto gerado está vazio.' });
        }

        return response.status(200).json({ text });

    } catch (error) {
        console.error('Erro interno do servidor ao chamar a API:', error);
        return response.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
    }
}
