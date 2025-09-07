// ok
// NOME DO ARQUIVO: components/chat/ChatHeader.js
// Componente refatorado para o cabeçalho do chat, com importações corrigidas.

import React from 'react';
// Ícones importados de ChatUI, que é o ficheiro correto.
import { SoundOnIcon, SoundOffIcon, MoreVerticalIcon, MinimizeIcon } from './ChatUI';

const ChatHeader = ({
    onlineUsersCount,
    isOptionsMenuVisible,
    toggleOptionsMenu,
    isMuted,
    onToggleMute,
    onMinimize,
    onCloseChat,
    onlineUsers,
    getRoleColor,
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
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">Online ({onlineUsersCount})</span>
                </div>
                <div className="hidden group-hover:block absolute top-full mt-2 w-64 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2 border dark:border-slate-700 z-10">
                    {onlineUsers.map(onlineUser => (
                        <div key={onlineUser.uid} className="flex items-center gap-3 p-2 rounded-md">
                            {getStatusIndicator(onlineUser.state)}
                            <p className={`font-medium ${getRoleColor(onlineUser.role)}`}>{onlineUser.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 relative">
                <button onClick={toggleOptionsMenu} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-indigo-700 rounded-full transition" aria-label="Abrir menu de opções">
                    <MoreVerticalIcon />
                </button>
                {isOptionsMenuVisible && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-lg rounded-lg border dark:border-slate-700 z-30">
                        <button onClick={onToggleMute} className="w-full text-left px-4 py-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-indigo-800">
                            {isMuted ? <SoundOnIcon/> : <SoundOffIcon/>} {isMuted ? "Ativar Som" : "Mutar Som"}
                        </button>
                        <button onClick={onMinimize} className="w-full text-left px-4 py-2 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-indigo-800">
                            <MinimizeIcon/> Minimizar
                        </button>
                        <button onClick={onCloseChat} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50">
                            Sair do Chat
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default ChatHeader;

