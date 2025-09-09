// NOME DO ARQUIVO: data/index.js
// NOVO: Este ficheiro centraliza a exportação de todos os dados de materiais
// para garantir que as importações noutras partes da aplicação funcionem corretamente.

import { productData, individualProducts } from './productData';
import * as contentData from './contentData';
import * as businessData from './businessData';

// Agrupa todos os dados num único objeto para exportação
export const materialsMap = {
    ...contentData,
    ...businessData,
    productData,
    individualProducts,
};

