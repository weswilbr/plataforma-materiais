// NOME DO ARQUIVO: components/materials/ProductShowcase.js
// NOVO: Este componente cria uma vitrine de produtos visualmente apelativa,
// com cartões interativos para cada item.

import React from 'react';
import Image from 'next/image';
import { materialsMap } from '../../data';

// --- Sub-componente: Cartão de Produto Individual ---
const ProductCard = ({ product, onProductSelect }) => (
    <div 
        className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => onProductSelect(product.id)}
        tabIndex="0" // Torna o elemento focável
        onKeyPress={(e) => e.key === 'Enter' && onProductSelect(product.id)} // Permite seleção com a tecla Enter
    >
        <Image 
            src={product.image} 
            alt={product.name} 
            width={400} 
            height={400} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Gradiente para garantir a legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white text-lg font-bold drop-shadow-md">{product.name}</h3>
        </div>
    </div>
);

// --- Componente Principal da Vitrine ---
export const ProductShowcase = ({ onProductSelect }) => {
    // <<< CORREÇÃO APLICADA AQUI >>>
    // Convertemos o objeto de produtos em um array de produtos.
    // O `|| {}` garante que o código não quebre se `individualProducts` for nulo ou indefinido.
    const productsArray = Object.values(materialsMap.individualProducts || {});

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-slate-200">Nossos Produtos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {/* Usamos o novo array para o .map() */}
                {productsArray.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product}
                        onProductSelect={onProductSelect}
                    />
                ))}
            </div>
        </div>
    );
};