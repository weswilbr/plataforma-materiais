// NOME DO ARQUIVO: tailwind.config.js
// ATUALIZAÇÃO: Adicionado o plugin @tailwindcss/forms para melhorar a estilização padrão dos formulários.

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // Adiciona o plugin de formulários
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
