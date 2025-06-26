# Diretrizes de Desenvolvimento

Este documento contém as diretrizes e padrões para desenvolvimento no projeto Juno. Seguir estas diretrizes garante consistência no código e facilita a colaboração entre os membros da equipe.

## 🔄 Fluxo de Trabalho

### Branches

- `main`: Branch de produção, sempre estável
- `develop`: Branch de desenvolvimento, para integração de features
- `feature/nome-da-feature`: Para desenvolvimento de novas funcionalidades
- `bugfix/nome-do-bug`: Para correção de bugs
- `hotfix/nome-do-hotfix`: Para correções urgentes em produção

## 🧩 Padrões de Código

### Geral

- Use TypeScript para todo o código
- Utilize ESLint e Prettier para formatação consistente
- Mantenha arquivos com no máximo 300 linhas
- Prefira funções e componentes pequenos e focados

### Nomenclatura

- **Componentes**: PascalCase (ex: `ProfileButton.tsx`)
- **Hooks**: camelCase com prefixo "use" (ex: `useAuth.ts`)
- **Contextos**: PascalCase com sufixo "Context" (ex: `IdiomaContext.tsx`)
- **Utilitários**: camelCase (ex: `formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_RETRY_ATTEMPTS`)

## 🧱 Estrutura de Componentes

### Padrão de Componente

```tsx
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "../ui/button"

import { useIdioma } from "@/contexts/idioma-context"

// Interface clara para props
interface ComponentProps {
  prop1: string
  prop2?: number
}

export function Component({ prop1, prop2 = 0 }: ComponentProps) {
  return (
    <div className="...">
      <h1>{prop1}</h1>
    </div>
  )
}
```

## 🎨 Estilização

- Utilize Tailwind CSS para estilização
- Siga a paleta de cores definida no tema:
  - `deep-black`: Fundo principal
  - `aged-bone`: Texto principal
  - `blood-red`: Destaque primário
  - `mystic-purple`: Destaque secundário
- Para componentes complexos, crie variantes usando `cva` (class-variance-authority)
- Mantenha responsividade em mente, começando pelo mobile-first

## 🗃️ Gerenciamento de Estado

- Use React Context para estado global compartilhado entre múltiplos componentes
- Prefira hooks personalizados para encapsular lógica de estado
- Para formulários, utilize `react-hook-form` com validação `zod`
- Mantenha o estado o mais local possível

## 🌐 Internacionalização

- Utilize o contexto de idioma (`IdiomaContext`) para textos
- Nunca hardcode strings diretamente no componente
- Acesse traduções via hook `useIdioma`:

```tsx
const { t } = useIdioma()
return <h1>{t('titulo.bemvindo')}</h1>
```

## ⚡ Performance

- Utilize `React.memo` para componentes que renderizam frequentemente
- Implemente virtualização para listas longas
- Otimize imagens usando o componente `Image` do Next.js
- Utilize lazy loading para componentes grandes
- Monitore e otimize o tamanho do bundle

## ♿ Acessibilidade

- Siga as diretrizes WCAG 2.1 nível AA
- Utilize componentes acessíveis do Radix UI
- Garanta navegação por teclado
- Forneça textos alternativos para imagens
- Mantenha contraste adequado para texto