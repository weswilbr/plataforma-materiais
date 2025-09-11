// NOME DO ARQUIVO: components/chat/ChatHeader.js
// ATUALIZAÇÃO: Adicionado um valor padrão à prop 'onlineUsers' para prevenir
// erros de renderização enquanto os dados são carregados.

import React from 'react';
import { MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from './ChatUI';

const ChatHeader = ({
    onlineUsers = [], // <<< CORREÇÃO APLICADA AQUI
    getRoleColor,
    onMinimize,
    onMaximize,
    onRestore,
    onCloseChat,
    chatSize,
}) => {

    const getStatusIndicator = (state) => {
        const color = state === 'online' ? 'bg-green-500' : 'bg-yellow-500';
        return (
            <span className="relative flex h-3 w-3">
                {state === 'online' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
            </span>
        );
    };

    return (
        <header className="p-4 border-b border-slate-200 dark:border-indigo-800 flex justify-between items-center flex-shrink-0">
            <div className="group relative">
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    {/* Este código agora é seguro e não vai quebrar */}
                    <span className="font-bold text-slate-800 dark:text-white">Online ({onlineUsers.length})</span>
                </div>
                <div className="hidden group-hover:block absolute top-full mt-2 w-64 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2 border dark:border-slate-700 z-10">
                    {onlineUsers.length > 0 ? (
                        onlineUsers.map(onlineUser => (
                            <div key={onlineUser.uid} className="flex items-center gap-3 p-2 rounded-md">
                                {getStatusIndicator(onlineUser.state)}
                                <p className={`font-medium ${getRoleColor(onlineUser.role)}`}>{onlineUser.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center p-2">Nenhum usuário online.</p>
                    )}
                </div>
            </div>
            
            <div className="flex items-center gap-1">
                <button onClick={onMinimize} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" title="Minimizar">
                    <MinimizeIcon />
                </button>
                {chatSize === 'normal' ? (
                    <button onClick={onMaximize} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" title="Maximizar">
                        <MaximizeIcon />
                    </button>
                ) : (
                    <button onClick={onRestore} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" title="Restaurar">
                        <RestoreIcon />
                    </button>
                )}
                <button onClick={onCloseChat} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" title="Fechar Chat">
                    <CloseIcon />
                </button>
            </div>
        </header>
    );
};

export default ChatHeader;