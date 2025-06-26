# Juno - Plataforma de Arcanos Digitais

Juno é uma aplicação web moderna para exploração de arcanos, tarot e conteúdo místico. Desenvolvida com Next.js e React, oferece uma experiência imersiva para os usuários interessados em misticismo e autoconhecimento.

![Juno Logo](public/logo.png)

## 🔮 Funcionalidades

- **Grimório Digital**: Acesso a uma coleção de arcanos e cartas de tarot
- **Leituras Personalizadas**: Interpretações baseadas no perfil do usuário
- **Biblioteca de Conteúdo**: Artigos e guias sobre misticismo
- **Sistema de Créditos**: Economia interna para acessar conteúdo premium
- **Perfil Personalizado**: Salve suas leituras e preferências
- **Notificações**: Receba alertas sobre novos conteúdos e recursos
- **Suporte a Múltiplos Idiomas**: Interface traduzida para diferentes línguas
- **Autenticação Social**: Login com Google, GitHub e credenciais

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

## 🛠️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/juno.git

# Entre na pasta do projeto
cd juno

# Instale as dependências
npm install
# ou
pnpm install
# ou
yarn install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 📁 Estrutura do Projeto

```
juno/
├── app/                  # Rotas e páginas da aplicação
│   ├── assinatura/       # Planos de assinatura
│   ├── biblioteca/       # Biblioteca de conteúdo
│   ├── grimorio/         # Coleção de arcanos
│   ├── historia/         # História e lore
│   ├── leitura/          # Leituras de tarot
│   ├── login/            # Autenticação
│   ├── loja/             # Loja de itens e créditos
│   ├── perfil/           # Perfil do usuário
│   ├── privacidade/      # Política de privacidade
│   └── termos/           # Termos de uso
├── components/           # Componentes React
│   └── arcana/           # Componentes específicos da aplicação
├── contexts/             # Contextos React
├── hooks/                # Hooks personalizados
├── lib/                  # Funções utilitárias
├── public/               # Arquivos estáticos
└── styles/               # Estilos globais
```

## 🧪 Testes

```bash
# Executar testes
npm run test
# ou
pnpm test
# ou
yarn test
```

## 🔐 Configuração de Autenticação

O projeto utiliza NextAuth.js para autenticação com suporte a login social (Google, GitHub) e login tradicional com email/senha.

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure as variáveis de ambiente no arquivo `.env.local`:
   - `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL
   - `NEXTAUTH_URL`: URL base da aplicação (ex: http://localhost:3000)
   - `NEXTAUTH_SECRET`: Chave secreta para criptografia de tokens (gere uma com `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`: Credenciais do OAuth do Google
   - `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`: Credenciais do OAuth do GitHub

3. Execute as migrações do Prisma para criar as tabelas de autenticação:
   ```bash
   npx prisma migrate dev
   ```

## 🌐 Ambiente de Produção

```bash
# Construir para produção
npm run build
# ou
pnpm build
# ou
yarn build

# Iniciar servidor de produção
npm run start
# ou
pnpm start
# ou
yarn start
```

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

## 👥 Contribuição

Consulte o arquivo [GUIDELINES.md](.junie/guidelines.md) para informações sobre como contribuir para este projeto.
