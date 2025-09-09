// NOME DO ARQUIVO: data/productData.js
// REFACTOR: Dados dos produtos extraídos de materials.js para este arquivo dedicado.

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
    riovidaburst: { name: 'RioVida Burst', image: '/images/products/riovidaburst.png', content: productContent('riovidaburst') },
    riovidastix: { name: 'RioVida Stix', image: '/images/products/riovidastix.png', content: productContent('riovidastix') },
    bioefa: { name: 'BioEFA', image: '/images/products/bioefa.png', content: productContent('bioefa') },
    energygostix: { name: 'Energy Go Stix', image: '/images/products/energygostix.png', content: productContent('energygostix') },
    tfplus: { name: 'TF-Plus', image: '/images/products/tfplus.png', content: productContent('tfplus') },
    tfplus30caps: { name: 'TF Plus 30 Cápsulas', image: '/images/products/tfplus30caps.png', content: productContent('tfplus30caps') },
    tfzinco: { name: 'TF-Zinco', image: '/images/products/tfzinco.png', content: productContent('tfzinco') },
    nutrastart: { name: 'Nutrastart', image: '/images/products/nutrastart.png', content: productContent('nutrastart') },
    protf: { name: 'PRO-TF', image: '/images/products/protf.png', content: productContent('protf') },
    colageno: { name: 'Collagen', image: '/images/products/collagen.png', content: productContent('colageno') },
    tfboost: { name: 'TF-Boost', image: '/images/products/tfboost.png', content: productContent('tfboost') },
    glutamineprime: { name: 'Glutamine Prime', image: '/images/products/glutamineprime.png', content: productContent('glutamineprime') },
    tfmastigavel: { name: 'TF Mastigável', image: '/images/products/tfmastigavel.png', content: productContent('tfmastigavel') },
};

export const individualProducts = Object.keys(productData).map(id => ({
    id,
    name: productData[id].name,
    image: productData[id].image,
}));
