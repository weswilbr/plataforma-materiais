// NOME DO ARQUIVO: components/materials/ChannelsPresenter.js
// NOVO: Componente dedicado para a secção "Canais".

import React, { useState } from 'react';
import { materialsMap } from '../../data';

export const ChannelsPresenter = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    const channelData = materialsMap.channels;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Canais Oficiais</h2>
            <div className="mb-4 border-b border-slate-200 dark:border-slate-700">
                <nav className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {Object.keys(channelData).map(channelType => (
                         <button
                            key={channelType}
                            onClick={() => setActiveTab(channelType)}
                            className={`inline-block p-4 border-b-2 rounded-t-lg capitalize ${activeTab === channelType ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-600 hover:border-slate-300'}`}
                        >
                           {channelType}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {Object.entries(channelData).map(([type, channels]) => (
                    <div key={type} className={`${activeTab === type ? 'block' : 'hidden'}`}>
                        <div className="space-y-4">
                            {channels.map(channel => (
                                <a key={channel.title} href={channel.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white dark:bg-indigo-800 rounded-lg shadow hover:bg-slate-50 dark:hover:bg-indigo-700 transition">
                                    {channel.title}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
