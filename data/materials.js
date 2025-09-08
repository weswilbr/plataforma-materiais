// NOME DO ARQUIVO: data/materials.js
// Centraliza todos os dados e links de materiais da plataforma.
// Versão atualizada com a estrutura de produtos padronizada e links locais.

export const professionalTestimonials = {
    'dra_lorenlay_rachid': { type: 'file', title: 'Dra. Lorenlay Rachid', description: 'Baixe o vídeo.', url: '/materials/profissionais/dra_lorenlay_rachid.mp4' },
    'dra_stella': { type: 'file', title: 'Dra. Stella', description: 'Baixe o vídeo.', url: '/materials/profissionais/dra_stella.mp4' },
    'dr_nelson_annunciato': { type: 'file', title: 'Dr. Nelson Annunciato', description: 'Baixe o vídeo.', url: '/materials/profissionais/dr_nelson_annunciato.mp4' },
    'dr_kleiner': { type: 'file', title: 'Dr. Kleiner', description: 'Baixe o vídeo.', url: '/materials/profissionais/dr_kleiner.mp4' },
    'dr_gino': { type: 'file', title: 'Dr. Gino', description: 'Baixe o vídeo.', url: '/materials/profissionais/dr_gino.mp4' },
    'dr_flavio': { type: 'file', title: 'Dr. Flavio', description: 'Baixe o vídeo.', url: '/materials/profissionais/dr_flavio.mp4' },
};

export const channels = {
    youtube: [
        { title: "Dr José Benjamín Pérez Y Sara Meléndez", url: "https://www.youtube.com/@DrJos%C3%A9Benjam%C3%ADnP%C3%A9rezySaraM" },
        { title: "Weslley William", url: "https://www.youtube.com/@empreendedor-tf" },
        { title: "4Life Brasil", url: "https://www.youtube.com/channel/UCNXgsoT8RJtIKfcLkiEqkgg" },
        { title: "El Equipo de Triunfo", url: "https://www.youtube.com/@ElEquipoDeTriunfo" },
    ],
    telegram: [
        { title: "El Equipo de Triunfo (Oficial)", url: "https://t.me/+HVC9HbTU1DUwYzUx" },
        { title: "Dr José Benjamín Pérez Y Sara Meléndez", url: "https://t.me/+GuKV_KJhFJtkZjZh" },
        { title: "Bot Equipe Triunfo Brasil", url: "https://t.me/material4life" },
    ],
    whatsapp: [
        { title: "El Equipo de Triunfo", url: "https://whatsapp.com/channel/0029VapdVhL2UPB8yH6yS23L" },
    ]
};

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

export const tablesMaterials = {
    precos_produtos: { afiliado: { type: 'file', title: 'Preço Afiliado', url: '/materials/tabelas/precos_produtos_afiliado.pdf' }, loja: { type: 'file', title: 'Preço Loja', url: '/materials/tabelas/precos_produtos_loja.pdf' }, consumidor: { type: 'file', title: 'Preço Consumidor', url: '/materials/tabelas/precos_produtos_consumidor.pdf' } },
    precos_kits: { toppacks: { type: 'file', title: 'Kit Top Packs', url: '/materials/tabelas/precos_kits_toppacks.pdf' }, faststart: { type: 'file', title: 'Kit Fast Start', url: '/materials/tabelas/precos_kits_faststart.pdf' }, fidelidade: { type: 'file', title: 'Kit Fidelidade', url: '/materials/tabelas/precos_kits_fidelidade.pdf' } },
    pontos: { type: 'file', title: 'Tabela de Pontos', url: '/materials/tabelas/pontos.pdf' },
    resgate_fidelidade: { type: 'file', title: 'Tabela Resgate Fidelidade', url: '/materials/tabelas/resgate_fidelidade.pdf' }
};

export const trainingMaterials = {
    "Material da Academia de Platinos": [
        { type: 'file', title: "Manejo de Objeções", url: "/materials/treinamento/Manejo_de_Objecoes.pdf" },
        { type: 'file', title: "Cuidados e Gerenciamento de clientes", url: "/materials/treinamento/Cuidados_e_Gerenciamento_de_Clientes.pdf" },
        { type: 'file', title: "Tipo de Fechamento - Lina Maria", url: "/materials/treinamento/Tipo_de_Fechamento_Lina_Maria.mp4" }
    ],
    "Tutoriais": [
        { type: 'file', title: "Simular Preço Produto no APP", url: "/materials/treinamento/Simular_Preco_Produto_no_APP.mp4" }
    ]
};

export const rewardsMaterials = {
    pdf: { type: 'file', title: 'Plano de Recompensas 2024', description: 'Baixe o documento completo.', url: '/materials/recompensas2024/plano_recompensas_2024.pdf' },
};

export const marketingMaterials = {
    youtube: { type: 'link', title: 'Assistir no YouTube', description: 'Veja o vídeo sobre Marketing de Rede.', url: 'https://www.youtube.com/watch?v=Fkeax_D_1m0' },
    arquivo: { type: 'file', title: 'Baixar Vídeo', description: 'Baixe o arquivo do vídeo para usar offline.', url: '/materials/marketing_rede/video_marketing_rede.mp4' },
};

export const brochureMaterials = {
    panfletos: { panfletoprodutosnovo: { type: 'file', title: 'Panfleto de Produtos', url: '/materials/folheteria/panfleto_produtos.pdf' }, panfletonovo4life: { type: 'file', title: 'Panfleto Oficial 4Life', url: '/materials/folheteria/panfleto_oficial_4life.pdf' }, },
    catalogo: { type: 'file', title: 'Catálogo 4Life', url: '/materials/folheteria/catalogo_4life.pdf' },
    enquete: { type: 'file', title: 'Enquete Imunidade', url: '/materials/folheteria/enquete_imunidade.pdf' },
};

export const loyaltyMaterials = {
    video_youtube: { type: 'link', title: 'Assistir no YouTube', description: 'Veja o vídeo sobre o Programa de Fidelidade.', url: 'https://youtu.be/f7bvrk7hh3U?si=-3PLes7BRFBcKPHY' },
    video_arquivo: { type: 'file', title: 'Baixar Vídeo', description: 'Baixe o arquivo do vídeo para usar offline.', url: '/materials/fidelidade/video_fidelidade.mp4' },
};

export const transferFactorMaterials = {
    video1: { type: 'file', title: 'Como funcionam os FTs', url: '/materials/fatores_transferencia/como_funcionam.mp4' },
    video2: { type: 'file', title: 'Animação - O que são os FTs', url: '/materials/fatores_transferencia/o_que_sao.mp4' },
    video3: { type: 'file', title: 'Os 3 R\'s do Sistema Imunológico', url: '/materials/fatores_transferencia/3_rs.mp4' },
    video4: { type: 'file', title: 'História com David Lisonbee', url: '/materials/fatores_transferencia/historia_lisonbee.mp4' },
    ft1: { type: 'file', title: 'FT1 (Formato vertical)', url: '/materials/fatores_transferencia/ft1_vertical.mp4' },
    capsula: { type: 'file', title: 'O caminho de uma cápsula', url: '/materials/fatores_transferencia/caminho_capsula.mp4' },
    table: { type: 'file', title: 'Tabela Porção de TF por produto', url: '/materials/fatores_transferencia/tabela_porcao.pdf' },
    pubmed: { type: 'link', title: 'NIH - PubMed Fatores de Transferência', url: 'https://youtu.be/v-h387fXKcA' }
};

export const factoryMaterials = {
    armazem: { type: 'file', title: 'Armazém 4Life', description: 'Conheça nosso centro de distribuição.', url: '/materials/fabrica/armazem.mp4' },
    envase: { type: 'file', title: 'Envase de Produtos', description: 'Veja o processo de envase e qualidade.', url: '/materials/fabrica/envase.mp4' },
    novafabrica: { type: 'file', title: 'Nova Fábrica 4Life', description: 'Tour pela nossa nova e moderna fábrica (2 vídeos).', url: '/materials/fabrica/nova_fabrica.mp4' }
};

export const bonusBuilderMaterials = {
    video_arquivo: { type: 'file', title: 'Vídeo Bônus Construtor', description: 'Baixe o arquivo de vídeo.', url: '/materials/bonus_construtor/video.mp4' },
    documento_guia: { type: 'file', title: 'Guia Bônus Construtor', description: 'Leia o guia completo em PDF.', url: '/materials/bonus_construtor/guia.pdf' },
    video_youtube: { type: 'link', title: 'Assistir no YouTube', description: 'Veja o vídeo explicativo.', url: 'https://youtu.be/iyMiw0VpQ0Q' }
};

export const opportunityMaterials = {
    video_completo: { type: 'link', title: 'Vídeo Completo (Link)', description: 'Apresentação completa da oportunidade.', url: 'https://youtu.be/ujAhVMjgzOs?si=Rr6BtJVmPi6ham7u' },
    video_compacto_link: { type: 'link', title: 'Vídeo Compacto (Link)', description: 'Versão resumida da apresentação (13 min).', url: 'https://youtu.be/EFfp0sfkp_8?si=sPzlYq1qaPi1S91q' },
    video_compacto_arquivo: { type: 'file', title: 'Vídeo Compacto (Arquivo)', description: 'Baixe o vídeo compacto.', url: '/materials/apresentacao/video_compacto.mp4' },
    pdf_apresentacao: { type: 'file', title: 'PDF Apresentação', description: 'Slides da apresentação em PDF.', url: '/materials/apresentacao/apresentacao.pdf' },
    powerpoint_apresentacao: { type: 'file', title: 'PowerPoint', description: 'Arquivo .pptx editável.', url: '/materials/apresentacao/apresentacao.pptx' },
    porque_4life_arquivo: { type: 'file', title: 'Por que 4Life? (Arquivo)', description: 'Baixe o vídeo que explica os diferenciais.', url: '/materials/apresentacao/porque_4life.mp4' },
    porque_4life_link: { type: 'link', title: 'Por que 4Life? (Link)', description: 'Assista ao vídeo sobre os diferenciais.', url: 'https://youtu.be/lmnWUrijAeM' }
};

const productOptions = ['perfil_tecnico', 'perfil_mobile_pdf', 'perfil_mobile_jpg', 'recorte_png', 'video1', 'video2', 'video1_vertical', 'video2_vertical', 'pitch_venda'];
const productContent = (productId) => ({
    perfil_tecnico: { type: 'file', title: 'Perfil Técnico', description: 'Baixe o perfil técnico do produto.', url: `/materials/produtos/${productId}/perfil-tecnico.pdf` },
    perfil_mobile_pdf: { type: 'file', title: 'Perfil Mobile (PDF)', description: 'Baixe a versão mobile do perfil.', url: `/materials/produtos/${productId}/perfil-mobile.pdf` },
    perfil_mobile_jpg: { type: 'file', title: 'Perfil Mobile (JPG)', description: 'Baixe a imagem mobile do perfil.', url: `/materials/produtos/${productId}/perfil-mobile2.jpg` },
    recorte_png: { type: 'file', title: 'Recorte (PNG)', description: 'Baixe a imagem do produto sem fundo.', url: `/materials/produtos/${productId}/recorte.png` },
    video1: { type: 'file', title: 'Vídeo 1', description: 'Baixe o vídeo principal.', url: `/materials/produtos/${productId}/video1.mp4` },
    video2: { type: 'file', title: 'Vídeo 2', description: 'Baixe o vídeo secundário.', url: `/materials/produtos/${productId}/video2.mp4` },
    video1_vertical: { type: 'file', title: 'Vídeo 1 (Vertical)', description: 'Baixe o vídeo em formato vertical.', url: `/materials/produtos/${productId}/video1-vertical.mp4` },
    video2_vertical: { type: 'file', title: 'Vídeo 2 (Vertical)', description: 'Baixe o vídeo secundário em formato vertical.', url: `/materials/produtos/${productId}/video2_vertical.mp4` }
});

export const productData = {
    riovidaburst: { name: 'RioVida Burst', image: '/images/products/riovidaburst.png', options: productOptions, content: productContent('riovidaburst') },
    riovidastix: { name: 'RioVida Stix', image: '/images/products/riovidastix.png', options: productOptions, content: productContent('riovidastix') },
    bioefa: { name: 'BioEFA', image: '/images/products/bioefa.png', options: productOptions, content: productContent('bioefa') },
    energygostix: { name: 'Energy Go Stix', image: '/images/products/energygostix.png', options: productOptions, content: productContent('energygostix') },
    tfplus: { name: 'TF-Plus', image: '/images/products/tfplus.png', options: productOptions, content: productContent('tfplus') },
    tfplus30caps: { name: 'TF Plus 30 Cápsulas', image: '/images/products/tfplus30caps.png', options: productOptions, content: productContent('tfplus30caps') },
    tfzinco: { name: 'TF-Zinco', image: '/images/products/tfzinco.png', options: productOptions, content: productContent('tfzinco') },
    nutrastart: { name: 'Nutrastart', image: '/images/products/nutrastart.png', options: productOptions, content: productContent('nutrastart') },
    protf: { name: 'PRO-TF', image: '/images/products/protf.png', options: productOptions, content: productContent('protf') },
    colageno: { name: 'Collagen', image: '/images/products/collagen.png', options: productOptions, content: productContent('colageno') },
    tfboost: { name: 'TF-Boost', image: '/images/products/tfboost.png', options: productOptions, content: productContent('tfboost') },
    glutamineprime: { name: 'Glutamine Prime', image: '/images/products/glutamineprime.png', options: productOptions, content: productContent('glutamineprime') },
    tfmastigavel: { name: 'TF Mastigável', image: '/images/products/tfmastigavel.png', options: productOptions, content: productContent('tfmastigavel') },
};

export const individualProducts = [
    { id: 'riovidaburst', name: 'RioVida Burst', image: '/images/products/riovidaburst.png' },
    { id: 'riovidastix', name: 'RioVida Stix', image: '/images/products/riovidastix.png' },
    { id: 'bioefa', name: 'Bioefa', image: '/images/products/bioefa.png' },
    { id: 'energygostix', name: 'Energy Go Stix', image: '/images/products/energygostix.png' },
    { id: 'tfplus', name: 'TF-Plus', image: '/images/products/tfplus.png' },
    { id: 'tfplus30caps', name: 'TF Plus 30 Cápsulas', image: '/images/products/tfplus30caps.png' },
    { id: 'tfzinco', name: 'TF-Zinco', image: '/images/products/tfzinco.png' },
    { id: 'nutrastart', name: 'Nutrastart', image: '/images/products/nutrastart.png' },
    { id: 'protf', name: 'PRO-TF', image: '/images/products/protf.png' },
    { id: 'colageno', name: 'Collagen', image: '/images/products/collagen.png' },
    { id: 'tfboost', name: 'TF-Boost', image: '/images/products/tfboost.png' },
    { id: 'glutamineprime', name: 'Glutamine Prime', image: '/images/products/glutamineprime.png' },
    { id: 'tfmastigavel', name: 'TF Mastigável', image: '/images/products/tfmastigavel.png' },
];

export const artsMaterials = {
    artes_fixas: {
        arte_camiseta: { type: 'file', title: 'Logo 4Life (Camisetas)', description: 'Baixe o arquivo para usar em camisetas.', url: '/materials/artes/arte_camiseta.png' },
        banner_produtos: { type: 'file', title: 'Banner de Produtos', description: 'Banner genérico com vários produtos.', url: '/materials/artes/banner_produtos.jpg' },
    },
    criativos: {
        imagem_estatica: { type: 'file', title: 'Imagem Estática', description: 'Modelo de imagem para feed.', url: '/materials/artes/imagem_estatica.jpg' },
        carrossel: { type: 'file', title: 'Carrossel', description: 'Exemplo de carrossel para redes sociais.', url: '/materials/artes/carrossel.mp4' },
        video_curto: { type: 'file', title: 'Vídeo Curto', description: 'Modelo de vídeo para Reels ou Stories.', url: '/materials/artes/video_curto.mp4' },
    }
};

// AGRUPAMENTO DE TODOS OS MATERIAIS
export const materialsMap = {
    professionalTestimonials,
    channels,
    positionsData,
    glossaryTerms,
    tablesMaterials,
    trainingMaterials,
    rewardsMaterials,
    marketingMaterials,
    brochureMaterials,
    loyaltyMaterials,
    transferFactorMaterials,
    factoryMaterials,
    productData,
    individualProducts,
    opportunityMaterials,
    bonusBuilderMaterials,
    artsMaterials,
};

