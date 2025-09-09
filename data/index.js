// NOME DO ARQUIVO: data/index.js
// NOVO: Este ficheiro centraliza a exportação de todos os módulos de dados,
// simplificando as importações nos componentes.

import { productData, individualProducts } from './productData';
import { positionsData, glossaryTerms } from './businessData';
import * as content from './contentData';

export const materialsMap = {
    ...content,
    productData,
    individualProducts,
    positionsData,
    glossaryTerms
};
