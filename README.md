# Projeto Rocket Corp - Frontend

Este repositório marca o início do nosso projeto frontend para o desafio Rocket Corp, parte do Rocket Lab. Nosso grupo está animado para desenvolver as soluções propostas e colaborar ao máximo para o sucesso do projeto.

## Participantes

Nosso time é formado pelos seguintes integrantes:

- [Alice Cadete](https://github.com/alicecadete28)
- [Arthur Lins](https://github.com/ArthurLins00)
- [Erico Chen](https://github.com/erico-chen)
- [Luan Bezerra](https://github.com/luanbezerra)
- [José Mário](https://github.com/MF853)
- [Raylandson Cesário](https://github.com/Raylandson)

## 📖 Resumo do Projeto

Este projeto consiste em um frontend moderno desenvolvido com React, utilizando TypeScript para maior robustez, Vite para build e desenvolvimento rápido, Tailwind CSS para estilização e pnpm como gerenciador de pacotes. O frontend consome a API do backend Rocket Corp, oferecendo uma interface intuitiva e responsiva para os usuários.
Você pode visualizar o nosso repositório do backend em: https://github.com/MF853/Rocketcorp-BackEnd

## 🛠️ Tecnologias

- **React** - Biblioteca para construção de interfaces de usuário
- **TypeScript** - Superset do JavaScript para tipagem estática
- **Vite** - Ferramenta de build e desenvolvimento rápido
- **Tailwind CSS** - Framework utilitário para estilização
- **pnpm** - Gerenciador de pacotes rápido e eficiente

## 🚀 Como executar o projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/Raylandson/Rocketcorp-frontend.git
cd Rocketcorp-frontend/rocket-corp
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, se necessário, com as seguintes variáveis (ajuste conforme o backend):

```env
VITE_API_URL="http://localhost:3000"
```

> **⚠️ Importante**: Certifique-se de que a URL da API corresponde ao endereço onde o backend está rodando.

### 4. Inicie a aplicação

```bash
pnpm run dev
```

A aplicação estará disponível em [http://localhost:5173](http://localhost:5173) (ou outra porta indicada pelo Vite).

## 📋 Scripts disponíveis

```bash
pnpm dev           # Iniciar aplicação em modo desenvolvimento
pnpm build         # Gerar build de produção
pnpm preview       # Visualizar build de produção localmente
pnpm lint          # Verificar código com ESLint
pnpm format        # Formatar código com Prettier
```

## 📁 Estrutura do projeto

```
src/
├── assets/                # Imagens e SVGs
├── components/            # Componentes reutilizáveis
├── contexts/              # Contextos do React
├── controllers/           # Lógica de controle
├── mocks/                 # Dados mockados para testes
├── models/                # Tipos e interfaces
├── pages/                 # Páginas principais da aplicação
├── services/              # Serviços de integração com API
├── types/                 # Tipos auxiliares
├── utils/                 # Funções utilitárias
├── App.tsx                # Componente principal
├── main.tsx               # Ponto de entrada da aplicação
└── index.css              # Estilos globais
```

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/SuaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona SuaFeature'`)
4. Push para a branch (`git push origin feature/SuaFeature`)
5. Abra um Pull Request

---

Vamos juntos nessa jornada! 🚀
