# GuideLab - Guia Inteligente de Exames Laboratoriais

> Projeto acadêmico desenvolvido para o curso de Análise e Desenvolvimento de Sistemas (UNIFACISA).

O **GuideLab** é uma plataforma focada em otimizar o atendimento e a organização pessoal de exames laboratoriais. O sistema permite que os usuários selecionem categorias de interesse, recebam recomendações precisas de exames (incluindo tempo de resultado e necessidade de jejum) e gerenciem suas próprias listas para impressão ou consulta.

A arquitetura foi pensada para garantir velocidade e segurança, com uma interface minimalista e focada na Experiência do Usuário (UI/UX), ideal para a rotina acelerada de ambientes clínicos e laboratoriais.

---

##  Funcionalidades Principais

- **Autenticação Segura:** Sistema de Login e Cadastro com criptografia e controle de sessão via JWT (JSON Web Tokens).
- **Recomendação Inteligente:** Sugestão de exames baseada no perfil preenchido (Idade e Sexo).
- **Gestão de Listas (Master-Detail):** Criação, visualização e exclusão de listas personalizadas de exames com layout responsivo.
- **Preparação para Impressão:** Módulo nativo para impressão direta das listas geradas.
- **Proteção de Rotas:** Bloqueio de acesso não autorizado nas telas privadas do React e na API.

---

## Tecnologias Utilizadas

O projeto foi construído no padrão **SPA (Single Page Application)** com separação total entre Cliente e Servidor.

**Front-end (Interface):**
- React (via Vite)
- React Router DOM (Navegação)
- Axios (Comunicação com a API)
- CSS-in-JS (Estilização *Text-only UI* sem dependências externas)

**Back-end (Servidor & API):**
- Node.js com Express
- Sequelize (ORM)
- SQLite (Banco de Dados embutido)
- JSON Web Token (Autenticação)

---

##  Como executar o projeto localmente

Para rodar o GuideLab na sua máquina, você precisará ter o [Node.js](https://nodejs.org/) instalado.

### 1. Preparando o Back-end
Abra um terminal na raiz do projeto e navegue até a pasta do servidor:
```bash
cd backend
npm install
npm run seed 
npm run dev   
```

### 2. Preparando o Front-end
Abra um **segundo terminal** na raiz do projeto e navegue até a interface:
```bash
cd frontend
npm install
npm run dev   
```

O sistema abrirá automaticamente no seu navegador padrão (geralmente em `http://localhost:5173/`).

---

## 👨‍💻 Desenvolvedor
Projeto estruturado e desenvolvido por **Erick Pontes**.