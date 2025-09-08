// NOME DO ARQUIVO: components/ProspectsList.js
// COMPONENTE ATUALIZADO: Adicionados campos de localização, resumo no rodapé e edição de status diretamente na tabela.

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';

// --- Ícones ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.42.2.46.2a.38.38 0 0 1 .18.42c-.06.26-.45.9-.56 1.05c-.1.15-.26.2-.4.13c-.15-.06-.6-.26-1.12-.5c-.54-.25-1.04-.58-1.48-.98c-.44-.4-.8-1-.9-1.16c-.1-.18-.04-.28.04-.38c.08-.08.18-.2.25-.26c.08-.08.13-.13.18-.2a.5.5 0 0 0 .04-.42c-.05-.13-.45-1.08-.6-1.48c-.16-.4-.3-.34-.42-.34c-.1-.02-1 .08-1.13.08c-.13 0-.3.03-.45.2c-.15.15-.58.55-.58 1.35s.6 1.58.68 1.7c.08.1.58 1.25 2 2.3c1.4 1.05 2.15 1.25 2.53 1.25c.38 0 .6-.08.7-.28c.1-.2.45-.85.5-1.1c.06-.25.04-.48-.03-.55c-.08-.08-.18-.13-.38-.23zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;

const AddProspectForm = ({ onAdd, isLoading }) => {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !whatsapp.trim()) {
            alert('Nome e WhatsApp são obrigatórios.');
            return;
        }
        if (phone.trim() && !/^\d{10,13}$/.test(phone)) {
            alert('O número de telefone deve conter entre 10 a 13 dígitos.');
            return;
        }
        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        onAdd({ name, whatsapp, phone, email, city, state });
        setName('');
        setWhatsapp('');
        setPhone('');
        setEmail('');
        setCity('');
        setState('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-50 dark:bg-indigo-800/50 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Adicionar Novo Prospecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do prospecto*" className="w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp (ex: 55119...)*" className="w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone (opcional)" className="w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (opcional)" className="w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade (opcional)" className="lg:col-span-2 w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="Estado (opcional)" className="w-full bg-white dark:bg-indigo-800 border border-slate-300 dark:border-indigo-700 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 active:bg-blue-800 transition shadow-lg disabled:bg-slate-400 flex items-center justify-center gap-2">
                    {isLoading ? <div className="loader"></div> : <><PlusIcon /> Adicionar</>}
                </button>
            </div>
        </form>
    );
};

const EditProspectModal = ({ prospect, onSave, onClose, isLoading }) => {
    const [name, setName] = useState(prospect.name);
    const [whatsapp, setWhatsapp] = useState(prospect.whatsapp);
    const [phone, setPhone] = useState(prospect.phone || '');
    const [email, setEmail] = useState(prospect.email || '');
    const [city, setCity] = useState(prospect.city || '');
    const [state, setState] = useState(prospect.state || '');
    const [status, setStatus] = useState(prospect.status || 'contato-inicial');

    const statusOptions = { 'contato-inicial': 'Contato Inicial', 'convidado': 'Convidado', 'apresentacao': 'Viu Apresentação', 'seguimento': 'Em Seguimento', 'fechamento': 'Fechamento', 'cadastrado': 'Cadastrado!', 'descartado': 'Descartado' };
    
    const handleSave = () => {
        if (!name.trim() || !whatsapp.trim()) {
            alert('Nome e WhatsApp são obrigatórios.');
            return;
        }
        onSave(prospect.id, { name, whatsapp, phone, email, city, state, status });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 border-b dark:border-slate-700"><h3 className="text-xl font-bold text-slate-900 dark:text-white">Editar Prospecto</h3></div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nome</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">WhatsApp</label><input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Telefone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Cidade</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Estado</label><input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"/></div>
                    <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3"><option value="" disabled>Selecione</option>{Object.entries(statusOptions).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}</select></div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 font-semibold">Cancelar</button>
                    <button onClick={handleSave} disabled={isLoading} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:bg-blue-400 flex items-center gap-2">{isLoading ? <><div className="loader"></div><span>Salvando...</span></> : 'Salvar'}</button>
                </div>
            </div>
        </div>
    );
};

const ProspectsList = () => {
    const { user } = useAuth();
    const [prospects, setProspects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProspect, setEditingProspect] = useState(null);
    const [deletingProspect, setDeletingProspect] = useState(null);

    const statusOptions = { 'contato-inicial': 'Contato Inicial', 'convidado': 'Convidado', 'apresentacao': 'Viu Apresentação', 'seguimento': 'Em Seguimento', 'fechamento': 'Fechamento', 'cadastrado': 'Cadastrado!', 'descartado': 'Descartado' };
    const statusColors = { 'contato-inicial': 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200', 'convidado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', 'apresentacao': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', 'seguimento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', 'fechamento': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', 'cadastrado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 'descartado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' };

    useEffect(() => {
        if (!user) return;
        setIsLoading(true);
        const q = query(collection(db, `users/${user.uid}/prospects`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProspects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        }, (error) => {
            console.error("Erro ao buscar prospectos:", error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddProspect = async (data) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, `users/${user.uid}/prospects`), { ...data, status: 'contato-inicial', createdAt: serverTimestamp() });
        } catch (error) { console.error("Erro ao adicionar prospecto:", error); } 
        finally { setIsSubmitting(false); }
    };

    const handleUpdateProspect = async (id, data) => {
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, `users/${user.uid}/prospects`, id), { ...data, updatedAt: serverTimestamp() });
        } catch (error) { console.error("Erro ao atualizar prospecto:", error); }
        finally { setEditingProspect(null); setIsSubmitting(false); }
    };
    
    const handleStatusChange = async (id, status) => {
        try {
            await updateDoc(doc(db, `users/${user.uid}/prospects`, id), { status, updatedAt: serverTimestamp() });
        } catch (error) { console.error("Erro ao mudar status:", error); }
    };

    const handleDeleteProspect = async (id) => {
        try {
            await deleteDoc(doc(db, `users/${user.uid}/prospects`, id));
        } catch (error) { console.error("Erro ao apagar prospecto:", error); }
        finally { setDeletingProspect(null); }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Lista de Prospectos</h2>
            <AddProspectForm onAdd={handleAddProspect} isLoading={isSubmitting} />

            <div className="bg-white dark:bg-indigo-900 shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-indigo-800 dark:text-slate-300">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Contatos</th>
                                <th className="px-6 py-3">Localização</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center p-8">A carregar lista...</td></tr>
                            ) : prospects.length > 0 ? (
                                prospects.map(p => (
                                <tr key={p.id} className="border-b dark:border-indigo-800 hover:bg-slate-50 dark:hover:bg-indigo-800/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{p.name}</td>
                                    <td className="px-6 py-4">
                                        <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)} className={`text-xs font-medium rounded-full border-transparent focus:border-transparent focus:ring-0 appearance-none py-1 pl-2 pr-7 ${statusColors[p.status]}`}>
                                            {Object.entries(statusOptions).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 space-y-2">
                                        <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"><WhatsAppIcon /> {p.whatsapp}</a>
                                        {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:underline"><EmailIcon /> {p.email}</a>}
                                    </td>
                                    <td className="px-6 py-4">{p.city && p.state ? `${p.city}, ${p.state}` : p.city || p.state || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {deletingProspect === p.id ? (
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => handleDeleteProspect(p.id)} className="font-semibold text-red-500 text-xs">Apagar</button>
                                                <button onClick={() => setDeletingProspect(null)} className="font-semibold text-slate-500 text-xs">Cancelar</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end items-center gap-2">
                                                <button onClick={() => setEditingProspect(p)} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"><EditIcon /></button>
                                                <button onClick={() => setDeletingProspect(p.id)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"><DeleteIcon /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center p-8">Ainda não há prospectos. Comece por adicionar um!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && (
                    <div className="p-4 text-right text-sm text-slate-500 dark:text-slate-400 border-t dark:border-indigo-800">
                        Total de Prospectos: <strong>{prospects.length}</strong>
                    </div>
                )}
            </div>
            {editingProspect && <EditProspectModal prospect={editingProspect} onClose={() => setEditingProspect(null)} onSave={handleUpdateProspect} isLoading={isSubmitting} />}
        </div>
    );
};

export default ProspectsList;

