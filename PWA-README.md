# ARCANA PWA Implementation

Este documento descreve a implementação de Progressive Web App (PWA) no projeto ARCANA.

## O que foi implementado

1. **Web App Manifest**: Arquivo de manifesto que permite a instalação do app
2. **Service Worker**: Para funcionalidade offline e cache de recursos
3. **Página Offline**: Exibida quando o usuário está sem conexão
4. **Metadados PWA**: Tags meta para melhor integração com dispositivos

## Arquivos Criados/Modificados

- `public/manifest.json`: Manifesto da aplicação web
- `public/sw.js`: Service Worker para cache e funcionalidade offline
- `public/sw-register.js`: Script para registrar o Service Worker
- `public/offline.html`: Página exibida quando o usuário está offline
- `public/icon-generator.html`: Gerador de ícones para PWA
- `app/layout.tsx`: Atualizado para incluir metadados PWA e script de registro

## Configuração Necessária

### 1. Gerar Ícones

Antes de testar a PWA, você precisa gerar os ícones necessários:

1. Abra o arquivo `public/icon-generator.html` em um navegador
2. Clique nos botões de download para baixar os ícones gerados
3. Coloque os ícones baixados (`icon-192.png` e `icon-512.png`) na pasta `public/`

### 2. Configuração HTTPS (para produção)

Para que a PWA funcione corretamente em produção, o site deve ser servido via HTTPS.
Em desenvolvimento local, o Service Worker funcionará em `localhost` ou `127.0.0.1` mesmo sem HTTPS.

## Como Testar a PWA

### Em Desenvolvimento

1. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

2. Abra o Chrome e navegue para `http://localhost:3000`

3. Abra as Ferramentas de Desenvolvedor (F12)

4. Vá para a aba "Application" > "Service Workers" para verificar se o Service Worker está registrado

5. Para testar a funcionalidade offline:
   - Vá para a aba "Network" nas Ferramentas de Desenvolvedor
   - Marque a opção "Offline"
   - Recarregue a página - você deverá ver a página offline

6. Para testar a instalação:
   - No Chrome, você verá um ícone "+" na barra de endereço ou um menu "Instalar aplicativo"
   - Clique para instalar a PWA

### Em Produção

1. Faça o build da aplicação:
   ```
   npm run build
   ```

2. Implante em um servidor com HTTPS

3. Visite o site em um dispositivo móvel para testar a instalação e funcionalidade offline

## Recursos Adicionais

- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse): Use para verificar a qualidade da PWA
- [PWA Builder](https://www.pwabuilder.com/): Ferramenta para melhorar sua PWA
- [Workbox](https://developers.google.com/web/tools/workbox): Biblioteca para Service Workers (para implementações mais avançadas)

## Próximos Passos Recomendados

1. **Melhorar os ícones**: Substitua os ícones gerados por designs profissionais
2. **Implementar sincronização em segundo plano**: Para operações quando o usuário estiver offline
3. **Adicionar notificações push**: Para engajar usuários mesmo quando não estão usando o app
4. **Otimizar estratégias de cache**: Ajustar o Service Worker para diferentes tipos de conteúdo