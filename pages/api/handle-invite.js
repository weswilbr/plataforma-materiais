// NOME DO ARQUIVO: pages/api/handle-invite.js
// API segura para gerir convites: criar (admin), verificar e aceitar (novo utilizador).

import admin from '../../firebaseAdmin';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase-admin/firestore';

const db = getFirestore();

export default async function handler(req, res) {
    if (req.method === 'POST') { // Criar novo convite (Ação de Admin)
        try {
            const newInviteRef = await addDoc(collection(db, 'invites'), {
                status: 'pending',
                createdAt: serverTimestamp(),
            });
            return res.status(200).json({ inviteCode: newInviteRef.id });
        } catch (error) {
            return res.status(500).json({ error: 'Falha ao criar o convite.' });
        }
    }

    if (req.method === 'PUT') { // Aceitar convite e registar utilizador
        const { inviteCode, name, email, password } = req.body;

        if (!inviteCode || !name || !email || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const inviteRef = doc(db, 'invites', inviteCode);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists() || inviteSnap.data().status !== 'pending') {
            return res.status(400).json({ error: 'Código de convite inválido ou já utilizado.' });
        }

        try {
            // Cria o utilizador no Firebase Authentication
            const userRecord = await admin.auth().createUser({ email, password, displayName: name });
            
            // Cria o perfil do utilizador no Firestore
            await setDoc(doc(db, "users", userRecord.uid), {
                name: name,
                role: 'user', // Novos utilizadores são sempre 'user'
                email: email,
            });
            
            // Atualiza o convite para 'accepted'
            await setDoc(inviteRef, { status: 'accepted', usedBy: userRecord.uid, usedAt: serverTimestamp() }, { merge: true });
            
            return res.status(200).json({ success: true, uid: userRecord.uid });

        } catch (error) {
            if (error.code === 'auth/email-already-exists') {
                return res.status(400).json({ error: 'Este email já está a ser utilizado.' });
            }
            console.error('Erro ao registar utilizador:', error);
            return res.status(500).json({ error: 'Ocorreu um erro ao criar a conta.' });
        }
    }

    return res.status(405).json({ error: 'Método não permitido.' });
}
