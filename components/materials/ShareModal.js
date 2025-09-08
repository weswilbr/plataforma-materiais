// NOME DO ARQUIVO: components/materials/ShareModal.js
// DESCRIÇÃO: Componente para a janela de partilha de materiais com a lista de prospectos.

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { WhatsAppIcon } from './MaterialUI';

const ShareModal = ({ material, onClose }) => {
    const { user } = useAuth();
    const [prospects, setProspects] = useState([]);
    const [selectedProspects, setSelectedProspects] = useState([]);
    const [sharedLinks, setSharedLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchProspects = async () => {
            const q = query(collection(db, `users/${user.uid}/prospects`));
            const querySnapshot = await getDocs(q);
            const prospectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProspects(prospectsData);
            setIsLoading(false);
        };
        fetchProspects();
    }, [user]);

    const handleSelectProspect = (prospectId) => {
        setSelectedProspects(prev => 
            prev.includes(prospectId) ? prev.filter(id => id !== prospectId) : [...prev, prospectId]
        );
    };

    const handleShare = () => {
        const links = [];
        // Constrói a URL completa e pública do ficheiro para partilha externa.
        const shareUrl = `${window.location.origin}${material.url}`;

        const baseMessage = material.productName
            ? `Olá [NOME], tudo bem? A pensar no nosso último contacto, queria partilhar consigo este material sobre o produto ${material.productName}. Acho que pode ser do seu interesse!\n\n${shareUrl}`
            : `Olá [NOME], tudo bem? Queria partilhar consigo este material sobre a nossa oportunidade de negócio. Penso que vai gostar!\n\n${shareUrl}`;
        
        selectedProspects.forEach(prospectId => {
            const prospect = prospects.find(p => p.id === prospectId);
            if (prospect) {
                const message = baseMessage.replace('[NOME]', prospect.name.split(' ')[0]);
                const whatsappUrl = `https://wa.me/${prospect.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                links.push({ name: prospect.name, url: whatsappUrl });
            }
        });
        setSharedLinks(links);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Partilhar "{material.title}"</h3>
                </div>

                {sharedLinks.length > 0 ? (
                    <div className="p-6">
                        <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Links de Partilha Gerados:</h4>
                        <ul className="space-y-3 max-h-64 overflow-y-auto">
                            {sharedLinks.map(link => (
                                <li key={link.name}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                        <span className="font-medium dark:text-white">Enviar para {link.name}</span>
                                        <span className="flex items-center gap-2 text-green-600 dark:text-green-400"><WhatsAppIcon /> Abrir WhatsApp</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="p-6">
                        <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Selecione os prospectos:</h4>
                        <div className="max-h-64 overflow-y-auto border dark:border-slate-700 rounded-lg p-2">
                            {isLoading ? <p>A carregar prospectos...</p> : prospects.length > 0 ? (
                                prospects.map(prospect => (
                                    <label key={prospect.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={selectedProspects.includes(prospect.id)} onChange={() => handleSelectProspect(prospect.id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/>
                                        <span className="ml-3 text-slate-700 dark:text-slate-300">{prospect.name}</span>
                                    </label>
                                ))
                            ) : <p>Nenhum prospecto encontrado.</p>}
                        </div>
                    </div>
                )}

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition">Fechar</button>
                    {sharedLinks.length === 0 && (
                        <button onClick={handleShare} disabled={selectedProspects.length === 0} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:bg-blue-400">
                            Gerar Links ({selectedProspects.length})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;

