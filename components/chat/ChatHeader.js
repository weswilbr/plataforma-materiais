// NOME DO ARQUIVO: components/chat/ChatHeader.js
// APRIMORAMENTO: Adicionado um menu de status para cada utilizador na lista,
// visível e funcional apenas para administradores.

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from './ChatUI';

const ChatHeader = ({
    onlineUsers = [],
    getRoleColor,
    onMinimize,
    onMaximize,
    onRestore,
    onCloseChat,
    chatSize,
}) => {
    const { user, setOtherUserChatStatus } = useAuth();
    const [menuOpenFor, setMenuOpenFor] = useState(null);

    const statusOptions = [
        { state: 'online', label: 'Online', color: 'bg-green-500' },
        { state: 'busy', label: 'Ocupado', color: 'bg-red-500' },
        { state: 'away', label: 'Ausente', color: 'bg-yellow-500' },
        { state: 'offline', label: 'Desconectar', color: 'bg-gray-500' },
    ];

    const getStatusIndicator = (state) => {
        const status = statusOptions.find(s => s.state === state) || { color: 'bg-gray-500' };
        return (
            <span className={`relative flex h-3 w-3`}>
                {state === 'online' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75`}></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${status.color}`}></span>
            </span>
        );
    };

    const handleStatusChange = (targetUser, newState) => {
        setOtherUserChatStatus(targetUser, newState);
        setMenuOpenFor(null); // Fecha o menu após a seleção
    };

    return (
        <header className="p-4 border-b border-slate-200 dark:border-indigo-800 flex justify-between items-center flex-shrink-0">
            <div className="group relative">
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">Online ({onlineUsers.length})</span>
                </div>
                <div className="hidden group-hover:block absolute top-full mt-2 w-64 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2 border dark:border-slate-700 z-10">
                    {onlineUsers.length > 0 ? onlineUsers.map(onlineUser => (
                        <div key={onlineUser.uid} className="relative flex items-center justify-between gap-3 p-2 rounded-md">
                            <div className="flex items-center gap-3">
                                {getStatusIndicator(onlineUser.state)}
                                <p className={`font-medium ${getRoleColor(onlineUser.role)} truncate`}>{onlineUser.name}</p>
                            </div>
                            
                            {/* MENU DE ADMIN */}
                            {user.role === 'admin' && user.uid !== onlineUser.uid && (
                                <div className="relative">
                                    <button onClick={() => setMenuOpenFor(menuOpenFor === onlineUser.uid ? null : onlineUser.uid)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                        <div className={`w-3 h-3 rounded-full ${statusOptions.find(s => s.state === onlineUser.state)?.color || 'bg-gray-500'}`}></div>
                                    </button>
                                    
                                    {menuOpenFor === onlineUser.uid && (
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-slate-100 dark:bg-slate-900 rounded-md shadow-lg p-1 z-20 border dark:border-slate-700">
                                            {statusOptions.map(option => (
                                                <button 
                                                    key={option.state}
                                                    onClick={() => handleStatusChange(onlineUser, option.state)}
                                                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm rounded-md text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
                                                    <span>{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )) : (
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