<!-- NOME DO ARQUIVO: README.md -->

Gerador de Convites com IA (Versão Next.js)
Este projeto foi reestruturado para usar Next.js, um framework React que oferece uma excelente experiência de desenvolvimento e otimizações de produção, incluindo renderização no servidor e API routes.

Estrutura de Pastas
/pages: Contém as páginas e as rotas da API.

/api/generate.js: A nossa função de backend segura que chama a API do Gemini.

index.js: A página principal da aplicação, agora como um componente React.

_app.js: O componente raiz da aplicação, onde os estilos globais são carregados.

/styles: Contém os arquivos de estilo.

globals.css: Estilos globais e configurações do Tailwind CSS.

package.json: As dependências e scripts do projeto.

tailwind.config.js: Arquivo de configuração do Tailwind CSS.

.gitignore: Arquivos a serem ignorados pelo Git, atualizado para Next.js.

Como Executar Localmente
Instale as dependências:

npm install

Crie um arquivo de ambiente:

Crie um arquivo chamado .env.local na raiz do projeto.

Adicione sua chave da API nele:

GEMINI_API_KEY=SUA_CHAVE_API_AQUI

Rode o servidor de desenvolvimento:

npm run dev

Abra http://localhost:3000 no seu navegador.

Deploy na Vercel
O deploy continua muito similar:

GitHub: Envie todos os novos arquivos e pastas para o seu repositório.

Vercel: A Vercel detectará automaticamente que é um projeto Next.js.

Variável de Ambiente: Vá para Settings -> Environment Variables no seu projeto na Vercel e adicione a GEMINI_API_KEY da mesma forma que antes. O Next.js lerá essa variável no lado do servidor.