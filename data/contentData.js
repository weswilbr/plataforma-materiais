// NOME DO ARQUIVO: data/contentData.js
// REFACTOR: Agrupa diversos materiais que estavam em materials.js.

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
