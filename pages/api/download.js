// NOME DO ARQUIVO: pages/api/download.js
// Esta API atua como um proxy seguro para forçar o download direto de arquivos.

import { materialsMap } from '../../data/materials';

// Função para resolver um caminho de string (ex: "opportunityMaterials.video_completo") em um objeto.
const resolvePath = (path, obj) => {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj || self);
};

export default async function handler(request, response) {
    const { path } = request.query;

    if (!path) {
        return response.status(400).json({ error: 'O caminho do arquivo é obrigatório.' });
    }

    const fileData = resolvePath(path, materialsMap);

    if (!fileData || !fileData.url || !fileData.url.includes('drive.google.com')) {
        return response.status(404).json({ error: `Arquivo não encontrado ou não é um link válido do Google Drive para o caminho: ${path}` });
    }

    try {
        // Extrai o ID do arquivo do link do Google Drive
        const fileId = fileData.url.split('/d/')[1].split('/')[0];
        const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        // Busca o arquivo do Google Drive a partir do servidor
        const fileResponse = await fetch(directDownloadUrl);

        if (!fileResponse.ok) {
            throw new Error('Falha ao buscar o arquivo do Google Drive.');
        }

        // Tenta obter um nome de arquivo mais descritivo
        let fileName = fileData.title ? `${fileData.title}.${fileData.url.split('.').pop()}` : path.split('.').pop();

        // Define os cabeçalhos para forçar o download no navegador do usuário
        response.setHeader('Content-Type', fileResponse.headers.get('content-type') || 'application/octet-stream');
        response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        // Envia o conteúdo do arquivo para o usuário
        const fileBuffer = await fileResponse.arrayBuffer();
        response.send(Buffer.from(fileBuffer));

    } catch (error) {
        console.error('Erro no proxy de download:', error);
        response.status(500).json({ error: 'Não foi possível processar o download.' });
    }
}

