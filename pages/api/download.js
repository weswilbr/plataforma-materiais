// NOME DO ARQUIVO: pages/api/download.js
// Esta API atua como um proxy seguro para forçar o download direto de arquivos do Google Drive.

import { materialsMap } from '../../data/materials';

export default async function handler(request, response) {
    const { fileKey } = request.query;

    if (!fileKey) {
        return response.status(400).json({ error: 'A chave do arquivo é obrigatória.' });
    }

    // Procura o arquivo em todos os materiais
    let fileUrl = null;
    let fileName = 'download'; // Nome padrão

    const findFile = (obj) => {
        for (const key in obj) {
            if (key === fileKey && obj[key].url) {
                fileUrl = obj[key].url;
                fileName = obj[key].title || fileKey;
                return true;
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (findFile(obj[key])) return true;
            }
        }
        return false;
    };

    findFile(materialsMap);

    if (!fileUrl || !fileUrl.includes('drive.google.com')) {
        return response.status(404).json({ error: 'Arquivo não encontrado ou não é um link do Google Drive.' });
    }

    try {
        // Extrai o ID do arquivo do link do Google Drive
        const fileId = fileUrl.split('/d/')[1].split('/')[0];
        const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        // Busca o arquivo do Google Drive
        const fileResponse = await fetch(directDownloadUrl);

        if (!fileResponse.ok) {
            throw new Error('Falha ao buscar o arquivo do Google Drive.');
        }

        // Obtém o nome do arquivo do cabeçalho, se disponível
        const disposition = fileResponse.headers.get('content-disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                fileName = matches[1].replace(/['"]/g, '');
            }
        }

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
