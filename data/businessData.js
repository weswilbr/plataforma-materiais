// NOME DO ARQUIVO: data/businessData.js
// REFACTOR: Dados de negócio (ranking, glossário) extraídos de materials.js.

export const positionsData = {
    "Associate": { emoji: "🔹", pv_mensal: 50, inscritos_pessoais: 1, media_ganho: 233.0, nivel_categoria: "Início", observacao: "1 cliente preferencial ou afiliado pessoal" },
    "Builder": { emoji: "🔸", pv_mensal: 50, inscritos_pessoais: 3, media_ganho: 490.0, nivel_categoria: "Construção", observacao: "3 inscritos pessoais com 50 PV/mês" },
    "Builder Elite": { emoji: "🔶", pv_mensal: 50, inscritos_pessoais: 3, lp_nos_3_niveis: 1000, media_ganho: 980.0, nivel_categoria: "Construção", observacao: "3 inscritos pessoais ativos com 50 PV/mês" },
    "Diamond": { emoji: "💎", pv_mensal: 50, inscritos_pessoais: 6, lp_nos_3_niveis: 3000, media_ganho: 2481.0, nivel_categoria: "Construção de Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Diamond Elite": { emoji: "💠", pv_mensal: 50, inscritos_pessoais: 6, lp_nos_3_niveis: 5000, linhas_qualificadas: [{ quantidade: 2, posicao: "Builder Elite" }], media_ganho: 4962.0, nivel_categoria: "Construção de Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Presidential": { emoji: "🏅", pv_mensal: 50, inscritos_pessoais: 8, lp_nos_3_niveis: 10000, linhas_qualificadas: [{ quantidade: 2, posicao: "Diamond" }], media_ganho: 7015.0, bonus_participacao: 3400.0, viagens_incentivo: true, nivel_categoria: "Construção de Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Presidential Elite": { emoji: "🥇", pv_mensal: 50, inscritos_pessoais: 8, lp_nos_3_niveis: 15000, linhas_qualificadas: [{ quantidade: 2, posicao: "Diamond Elite" }], media_ganho: 14030.0, bonus_participacao: 6800.0, viagens_incentivo: true, nivel_categoria: "Construção de Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Bronze": { emoji: "🥉", pv_mensal: 50, inscritos_pessoais: 10, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 2, posicao: "Presidential" }], media_ganho: 28493.0, bonus_participacao: 13600.0, viagens_incentivo: true, nivel_categoria: "Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Bronze Elite": { emoji: "🏆", pv_mensal: 50, inscritos_pessoais: 10, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Presidential" }], vo_rede: 50000.0, media_ganho: 56986.0, bonus_participacao: 27200.0, viagens_incentivo: true, nivel_categoria: "Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Silver": { emoji: "🥈", pv_mensal: 50, inscritos_pessoais: 10, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Presidential Elite" }], vo_rede: 100000.0, media_ganho: 63527.0, bonus_participacao: 54400.0, viagens_incentivo: true, nivel_categoria: "Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Silver Elite": { emoji: "🌟", pv_mensal: 50, inscritos_pessoais: 10, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Bronze" }], vo_rede: 175000.0, media_ganho: 95291.0, bonus_participacao: 108800.0, viagens_incentivo: true, nivel_categoria: "Liderança", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Gold": { emoji: "🥇", pv_mensal: 50, inscritos_pessoais: 12, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Silver" }], vo_rede: 250000.0, media_ganho: 154261.0, bonus_participacao: 178000.0, viagens_incentivo: true, nivel_categoria: "Liberdade Financeira", observacao: "Necessário já ter qualificado como Silver Elite pelo menos uma vez" },
    "Gold Elite": { emoji: "🏆", pv_mensal: 50, inscritos_pessoais: 12, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Gold" }], vo_rede: 500000.0, media_ganho: 308522.0, bonus_participacao: 356000.0, viagens_incentivo: true, nivel_categoria: "Liberdade Financeira", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Platinum": { emoji: "💍", pv_mensal: 50, inscritos_pessoais: 12, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Gold Elite" }], vo_rede: 1000000.0, media_ganho: 782086.0, viagens_incentivo: true, nivel_categoria: "Topo da Carreira", observacao: "Metade dos inscritos deve estar na linha de frente" },
    "Platinum Elite": { emoji: "👑", pv_mensal: 50, inscritos_pessoais: 12, lp_nos_3_niveis: 20000, linhas_qualificadas: [{ quantidade: 3, posicao: "Platinum" }], vo_rede: 2000000.0, media_ganho: 1564172.0, viagens_incentivo: true, nivel_categoria: "Topo da Carreira", observacao: "Metade dos inscritos deve estar na linha de frente" }
};

export const glossaryTerms = {
    'upline': { title: 'Upline', emoji: '🔝', definition: 'A linha de Afiliados diretamente acima de você.' },
    'matriculador': { title: 'Matriculador', emoji: '👤', definition: 'A pessoa que apresentou a 4Life para você (pode ser também o seu patrocinador).' },
    'patrocinador': { title: 'Patrocinador', emoji: '🧑‍💼', definition: 'A pessoa em sua linha upline que está diretamente acima de você.' },
    'volume_equipe': { title: 'Volume Equipe', emoji: '📈', definition: 'O Volume Principal, mais os pedidos de sua linha frontal de Clientes Preferenciais e Afiliados.' },
    'linha_frontal': { title: 'Linha Frontal', emoji: '👥', definition: 'Seu primeiro nível de Clientes Preferenciais e Afiliados que você patrocinou.' },
    'volume_tres_niveis': { title: 'Volume Três Níveis', emoji: '🔢', definition: 'Composto pelo total de seu Volume Principal (PV) e o PV combinado das pessoas em seus três primeiros níveis.' },
    'clientes_varejo': { title: 'Clientes Varejo', emoji: '🛒', definition: 'Clientes que compram os produtos da 4Life no preço de varejo.' },
    'clientes_preferenciais': { title: 'Clientes Preferenciais', emoji: '🏷️', definition: 'Clientes que se inscrevem para comprar produtos 4Life a preços de atacado.' },
    'downline': { title: 'Downline', emoji: '⬇️', definition: 'A linha de Afiliados e Clientes Preferenciais que ficam diretamente abaixo de você.' },
    'perna': { title: 'Perna', emoji: '📊', definition: 'Uma parte de seus downlines que começa com uma pessoa de sua linha frontal e continua abaixo daquele Afiliado.' },
    'lp': { title: 'Life Points (LP)', emoji: '💰', definition: 'Valor em pontos atribuído a cada produto da 4Life, usado para calcular comissões.' },
    'pv': { title: 'Volume Principal (PV)', emoji: '🏦', definition: 'O total de LP dos produtos comprados por você, para consumo próprio ou para venda a varejo.' },
    'vo': { title: 'Volume Organizacional (VO)', emoji: '📊', definition: 'Os LP de suas compras pessoais, clientes e todos os Afiliados e clientes em sua downline.' },
    'bonus_rapido': { title: 'Bônus Rápido', emoji: '💸', definition: 'Comissão de 25% sobre o primeiro pedido de cada novo Cliente Preferencial inscrito pessoalmente.' },
    'programa_fidelidade': { title: 'Programa Fidelidade', emoji: '🎁', definition: 'Recompensa Afiliados e Clientes Preferenciais que compram mensalmente com 15% em Pontos de Fidelidade.' },
    'compressao': { title: 'Compressão', emoji: '🔄', definition: 'Afiliados que não se qualificam não são contados no cálculo de comissões.' },
    'bonus_builder': { title: 'Bônus Builder', emoji: '🏆', definition: 'Bônus para incentivar Afiliados a inscrever novos clientes e reter sua rede.' }
};
