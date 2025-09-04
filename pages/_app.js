// NOME DO ARQUIVO: pages/_app.js
// Ponto de entrada da aplicação, onde o AuthProvider é injetado.

import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

