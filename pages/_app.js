// NOME DO ARQUIVO: pages/_app.js
// Ponto de entrada da aplicação, onde o AuthProvider é injetado e o tema é aplicado.

import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Efeito para aplicar o tema (claro/escuro) no carregamento inicial da aplicação
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
