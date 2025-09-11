// NOME DO ARQUIVO: components/NetworkVisualizer.js
// ATUALIZAÇÃO: Aprimorado com contagem de nós renderizados, linhas conectoras,
// animações e responsividade.

import React from 'react';

const Node = ({ level }) => {
    const levelColors = [
        'bg-sky-500 text-white',      // Nível 1 (Seus diretos)
        'bg-teal-500 text-white',     // Nível 2
        'bg-emerald-500 text-white',  // Nível 3
        'bg-indigo-500 text-white',   // Nível 4
    ];

    const shapes = ['rounded-full', 'rounded', 'rounded-tr']; // Círculo, quadrado, canto arredondado
    const nodeSize = ['w-6 h-6', 'w-5 h-5', 'w-4 h-4'];

    const shapeIndex = level % shapes.length;
    const sizeIndex = level % nodeSize.length;

    return (
        <div className={`flex items-center justify-center ${nodeSize[sizeIndex]} ${shapes[shapeIndex]} shadow-md ${levelColors[level] || 'bg-gray-400'}`}>
        </div>
    );
};

const MoreNodesIndicator = ({ count }) => (
    <div className="flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        +{count}
    </div>
);

const NetworkVisualizer = ({ levels }) => {
    // Limites para evitar sobrecarregar o DOM e manter a visualização limpa
    const MAX_NODES_TO_RENDER_PER_LEVEL = 16;
    const MAX_CHILDREN_PER_NODE = 5;

    const renderLevels = () => {
        let visualTree = [];
        let parentNodeCount = 1; // Começa com 1 ("Você")

        for (let i = 0; i < levels.length; i++) {
            const duplicationFactor = parseInt(levels[i], 10) || 0;
            if (duplicationFactor === 0) break; // Interrompe se a duplicação for zero

            const totalNodesInLevel = parentNodeCount * duplicationFactor;
            
            let nodesToRender = [];
            // Lógica para renderizar uma amostra representativa dos nós
            const parentsToRenderCount = Math.min(parentNodeCount, Math.floor(MAX_NODES_TO_RENDER_PER_LEVEL / Math.max(1, duplicationFactor)));

            for (let p = 0; p < parentsToRenderCount; p++) {
                const childrenCount = Math.min(duplicationFactor, MAX_CHILDREN_PER_NODE);
                for (let c = 0; c < childrenCount; c++) {
                    if (nodesToRender.length < MAX_NODES_TO_RENDER_PER_LEVEL) {
                        nodesToRender.push(<Node key={`${i}-${p}-${c}`} level={i} />);
                    }
                }
            }

            const remainingNodes = totalNodesInLevel - nodesToRender.length;
            const renderedNodeCount = nodesToRender.length;

            visualTree.push(
                <div key={`level-container-${i}`} className="flex flex-col items-center">
                    {/* Linha conectora vertical */}
                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>

                    {/* Wrapper do nível com contagem total */}
                    <div className="text-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Nível {i + 1}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                           {/* Mostrar a contagem exata dos nós renderizados */}
                            ({renderedNodeCount.toLocaleString('pt-BR')} de {totalNodesInLevel.toLocaleString('pt-BR')} pessoas)
                        </p>
                    </div>

                    {/* Nós visuais */}
                    <div className="flex justify-center flex-wrap gap-2 p-2 mt-2 min-h-[32px] animate-fade-in">
                        {nodesToRender}
                        {remainingNodes > 0 && <MoreNodesIndicator count={remainingNodes} />}
                    </div>
                </div>
            );
            
            // Atualiza a contagem para o próximo nível, sem ultrapassar o limite de renderização
            parentNodeCount = nodesToRender.length;
            if(parentNodeCount === 0 && totalNodesInLevel > 0) {
                 parentNodeCount = 1; // Garante que a lógica continue se a renderização for pequena
            }
        }
        return visualTree;
    };

    return (
        <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-center mb-4 text-slate-800 dark:text-slate-200">
                Visualização da Rede
            </h3>
            <div className="flex flex-col items-center">
                {/* O nó raiz: "Você" */}
                <div className="relative w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    Você
                    {/* Linha vertical que conecta o "Você" ao primeiro nível */}
                    {levels.length > 0 && <div className="absolute bottom-[-12px] w-px h-6 bg-slate-300 dark:bg-slate-600"></div>}
                </div>
                {renderLevels()}
            </div>
        </div>
    );
};

export default NetworkVisualizer;