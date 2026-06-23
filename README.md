# 🤖 GitHub AI Agent - MCP Server

Un servidor MCP (Model Context Protocol) que permite automatizar operaciones en GitHub mediante lenguaje natural, conectándose con LLMs como Claude o Gemini a través de Antigravity IDE.

---

## 📋 Descripción

GitHub AI Agent es un MCP Server construido con Node.js y TypeScript que expone tools para interactuar con la API de GitHub. Permite que un agente de IA ejecute acciones en GitHub mediante comandos en lenguaje natural, como crear repositorios, abrir issues, hacer commits, crear branches, pull requests y más.

### ¿Por qué es útil?

- Automatizá tareas repetitivas en GitHub sin salir de tu chat con IA
- Creá issues, commits y PRs con lenguaje natural
- Listá repositorios, issues y commits de cualquier usuario
- Cerrá issues, creá branches y PRs desde el chat
- Integrá flujos de trabajo de desarrollo con IA

---

## 🏗️ Diagrama de Arquitectura

Usuario 

↓

Antigravity IDE (Host)

↓

LLM

↓

GitHub MCP Server ← src/server.ts

↓

GitHub API (via Octokit)

**Roles:**
- **Host (Antigravity):** Aplicación que aloja el LLM y gestiona las conexiones MCP
- **Client (LLM):** El modelo de lenguaje que interpreta el lenguaje natural y decide qué tool usar
- **Server (tu código):** El MCP Server que expone las tools y ejecuta las operaciones en GitHub

---

## ⚙️ Requisitos del sistema

- Node.js 18 o superior
- npm 8 o superior
- Git
- Antigravity IDE instalado
- GitHub Personal Access Token con scopes: `repo`, `user`, `admin:org`, `workflow`

---

## 📦 Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/JoaquinG-eng/JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73.git
cd JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

Editá `.env` y agregá tu token de GitHub:

```env
GITHUB_TOKEN=ghp_tu_token_aqui
LOG_LEVEL=info
```

---

## 🔑 Cómo obtener un GitHub Personal Access Token

1. Andá a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Hacé click en **"Generate new token (classic)"**
3. Dale un nombre descriptivo: `GitHub MCP Server`
4. Seleccioná los siguientes scopes:
   - ✅ `repo` — acceso completo a repositorios
   - ✅ `user` — leer información del usuario
   - ✅ `admin:org` — administrar organizaciones
   - ✅ `workflow` — actualizar workflows de GitHub Actions
5. Hacé click en **"Generate token"**
6. Copiá el token generado (solo se muestra una vez)

> ⚠️ **Importante:** Nunca commiteés tu token al repositorio. Usá siempre el archivo `.env` que está en `.gitignore`.

---

## 🚀 Scripts disponibles

```bash
# Compilar TypeScript a JavaScript
npm run build

# Ejecutar el servidor MCP en modo desarrollo
npm run dev

# Ejecutar el servidor MCP (producción)
npm run start

# Correr todos los tests unitarios con Vitest
npm run test

# Abrir el MCP Inspector en el navegador para probar tools manualmente
npm run inspector

# ─── Smoke tests de operaciones de GitHub ───────────────────────────────────
npm run smoke               # Listar repositorios del usuario autenticado
npm run smoke:Usuario       # Obtener información de un usuario
npm run smoke:Commit        # Listar commits detallados de un repositorio
npm run smoke:Issues        # Listar issues de un repositorio
npm run smoke:PullRequests  # Listar pull requests de un repositorio
npm run smoke:Error         # Probar el manejo de errores

# ─── Smoke tests de tools MCP ───────────────────────────────────────────────
npm run smoke:ListRepos     # Tool list_repositories
npm run smoke:ListIssues    # Tool list_issues
npm run smoke:ListCommits   # Tool list_commits
npm run smoke:CreateRepo    # Tool create_repository
npm run smoke:CreateIssue   # Tool create_issue
npm run smoke:CreateCommit  # Tool create_commit
npm run smoke:CloseIssue    # Tool close_issue
npm run smoke:CreateBranch  # Tool create_branch
npm run smoke:CreatePR      # Tool create_pull_request
```

---

## ⚙️ Configuración en Antigravity IDE

1. Abrí Antigravity IDE
2. Andá a **File → Preferences → Antigravity IDE Settings**
3. Hacé click en **Customizations** en el menú izquierdo
4. Hacé click en **"Open MCP Config"**
5. Pegá la siguiente configuración reemplazando los valores con los tuyos:

```json
{
  "mcpServers": {
    "github-ai-agent": {
      "command": "C:\\Users\\TU_USUARIO\\Desktop\\JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73\\node_modules\\.bin\\tsx.cmd",
      "args": [
        "C:\\Users\\TU_USUARIO\\Desktop\\JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73\\src\\server.ts"
      ],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

6. Guardá con `Ctrl+S`
7. Reiniciá Antigravity IDE
8. Abrí un chat nuevo y probá con: *"Listame los repositorios de TU_USUARIO"*

---

## 🛠️ Tools disponibles

### 1. `list_repositories`
Lista todos los repositorios públicos de un usuario de GitHub.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `username` | string | ✅ | Nombre de usuario de GitHub |

**Ejemplo de prompt:**
> "Listame todos los repositorios de JoaquinG-eng"

---

### 2. `list_issues`
Lista los issues de un repositorio de GitHub.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |

**Ejemplo de prompt:**
> "Mostrá los issues del repositorio mi-proyecto de JoaquinG-eng"

---

### 3. `list_commits`
Lista los commits recientes de un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |

**Ejemplo de prompt:**
> "Mostrá los últimos commits de JoaquinG-eng/mi-proyecto"

---

### 4. `create_repository`
Crea un nuevo repositorio en GitHub para el usuario autenticado.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | string | ✅ | Nombre del repositorio (3-100 caracteres, alfanumérico) |
| `description` | string | ❌ | Descripción del repositorio |
| `isPrivate` | boolean | ❌ | Si el repositorio es privado (default: false) |

**Ejemplo de prompt:**
> "Creá un repositorio público llamado mi-nuevo-proyecto con la descripción Proyecto de prueba"

---

### 5. `create_issue`
Abre un nuevo issue en un repositorio de GitHub.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `title` | string | ✅ | Título del issue |
| `body` | string | ❌ | Descripción detallada del issue |

**Ejemplo de prompt:**
> "Abrí un issue en mi-proyecto que diga Bug en el login con descripción El botón de login no responde en móvil"

---

### 6. `create_commit`
Crea o modifica un archivo y hace commit en un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `message` | string | ✅ | Mensaje del commit |
| `filePath` | string | ✅ | Ruta del archivo a crear o modificar |
| `fileContent` | string | ✅ | Contenido del archivo |
| `branch` | string | ❌ | Branch destino (default: main) |

**Ejemplo de prompt:**
> "Hacé un commit en mi-proyecto agregando un archivo README.md con el contenido # Mi Proyecto"

---

### 7. `close_issue`
Cierra un issue existente en un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `issue_number` | number | ✅ | Número del issue a cerrar |

**Ejemplo de prompt:**
> "Cerrá el issue #5 del repositorio mi-proyecto de JoaquinG-eng"

---

### 8. `create_branch`
Crea una nueva branch en un repositorio.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `branchName` | string | ✅ | Nombre de la nueva branch |
| `fromBranch` | string | ❌ | Branch origen (default: main) |

**Ejemplo de prompt:**
> "Creá una branch llamada feature/nuevo-login a partir de main en mi-proyecto"

---

### 9. `create_pull_request`
Crea un pull request entre dos branches.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `owner` | string | ✅ | Dueño del repositorio |
| `repo` | string | ✅ | Nombre del repositorio |
| `title` | string | ✅ | Título del PR |
| `body` | string | ❌ | Descripción del PR |
| `head` | string | ✅ | Branch origen con los cambios |
| `base` | string | ❌ | Branch destino (default: main) |
| `draft` | boolean | ❌ | Si el PR es draft (default: false) |

**Ejemplo de prompt:**
> "Creá un PR desde feature/nuevo-login hacia main en mi-proyecto con el título feat: nuevo sistema de login"

---

## 🧪 Testing

### Correr tests unitarios

```bash
npm run test
```

El proyecto incluye 19 tests unitarios con Vitest que cubren:
- Validación de schemas (inputs válidos e inválidos)
- Casos edge (números negativos, strings vacíos, caracteres inválidos)
- Todas las tools del servidor

### Correr el MCP Inspector

```bash
npm run inspector
```

Abrí `http://localhost:6274` en el navegador para probar cada tool de forma interactiva sin necesidad de un LLM.

---

## 🗂️ Estructura del proyecto

 ProyectoM5-JoaquinGonzalezFT73/

 ├── src/                          # Código fuente principal
 │   ├── GitHub/                   # Capa de integración con GitHub API
 │   │   ├── Clients.ts            # Configuración e inicialización de Octokit con autenticación
 │   │   └── Operations.ts         # Funciones que llaman a la API de GitHub (commits, issues, repos, PRs)
 │   │
 │   ├── schemas/                  # Schemas de validación centralizados
 │   │   └── Schemas.ts            # Todos los schemas Zod y tipos TypeScript de cada tool
 │   │
 │   ├── tools/                    # Tools expuestas al LLM via MCP
 │   │   ├── listRepositories.ts   # Tool: listar repositorios de un usuario
 │   │   ├── listissues.ts         # Tool: listar issues de un repositorio
 │   │   ├── listCommits.ts        # Tool: listar commits de un repositorio
 │   │   ├── createRepository.ts   # Tool: crear un nuevo repositorio
 │   │   ├── createIssue.ts        # Tool: abrir un nuevo issue
 │    │   ├── createCommit.ts       # Tool: crear o modificar un archivo con commit
 │   │   ├── closeIssue.ts         # Tool: cerrar un issue existente
 │   │   ├── createBranch.ts       # Tool: crear una nueva branch
 │   │   └── createPullRequest.ts  # Tool: crear un pull request entre branches
 │   │
 │   ├── scripts/                  # Smoke tests para verificar integración real con GitHub API
 │   │   ├── smokeRepositorio.ts   # Prueba obtenerRepositoriosUsuario()
 │   │   ├── smokeUsuario.ts       # Prueba obtenerInformacionUsuario()
 │   │   ├── smokeCommit.ts        # Prueba GitHubCommitDetallado()
 │   │   ├── smokeIssues.ts        # Prueba GitHubIssues()
 │   │   ├── smokePullRequests.ts  # Prueba GitHubPullRequests()
 │   │   ├── smokeError.ts         # Prueba handleGitHubError()
│   │   ├── smokeListRepositories.ts  # Prueba listRepositoriesTool()
│   │   ├── smokeListIssues.ts    # Prueba listIssuesTool()
│   │   ├── smokeListCommits.ts   # Prueba listCommitsTool()
│   │   ├── smokeCreateRepository.ts  # Prueba createRepositoryTool()
│   │   ├── smokeCreateIssue.ts   # Prueba createIssueTool()
│   │   ├── smokeCreateCommit.ts  # Prueba createCommitTool()
│   │   ├── smokeCloseIssue.ts    # Prueba closeIssueTool()
│   │   ├── smokeCreateBranch.ts  # Prueba createBranchTool()
│   │   └── smokeCreatePullRequest.ts  # Prueba createPullRequestTool()
│   │
│   ├── utils/                    # Utilidades compartidas
│   │   ├── logging.ts            # Logger estructurado con niveles (debug/info/warn/error) y timestamps
│   │   └── retry.ts              # Exponential backoff para reintentos en rate limiting y errores 5xx
│   │
│   ├── types.ts                  # Interfaces TypeScript compartidas (GitHubRepositorio, GitHubIssues, etc.)
│   └── server.ts                 # Entry point del MCP Server — registra todas las tools y levanta el server via stdio
│
├── test/                         # Tests unitarios
│   └── schemas.test.ts           # 19 tests de validación de schemas con Vitest
│
├── .env                          # Variables de entorno locales (no commitear)
├── .env.example                  # Ejemplo de variables de entorno sin valores reales
├── .gitignore                    # Archivos ignorados por Git (node_modules, .env, dist)
├── tsconfig.json                 # Configuración de TypeScript para Node.js con ESModules
├── package.json                  # Dependencias, scripts y metadata del proyecto
└── README.md                     # Documentación completa del proyecto
---

### El servidor no arranca
- Verificá que `GITHUB_TOKEN` esté configurado en `.env`
- Asegurate de haber corrido `npm install`
- Verificá que Node.js sea versión 18 o superior con `node --version`

### Error 401 - Unauthorized
- Tu token de GitHub expiró o es inválido
- Generá un nuevo token en [github.com/settings/tokens](https://github.com/settings/tokens)
- Verificá que el token tenga los scopes correctos: `repo`, `user`, `admin:org`

### Error 404 - Not Found
- Verificá que el nombre del repositorio y el owner sean correctos
- Asegurate de que el repositorio exista en GitHub
- Los nombres son case-sensitive

### Error 429 - Rate Limit
- Esperá unos minutos, GitHub tiene límite de 5000 requests por hora
- El servidor reintenta automáticamente con exponential backoff (1s, 2s, 4s)

### El MCP Inspector muestra error de JSON
- Verificá que `dotenv.config({ quiet: true })` esté en `Clients.ts`
- Los logs van a `stderr`, no a `stdout` para no contaminar el protocolo MCP

### Antigravity no detecta el server
- Verificá que la ruta en `mcp_config.json` sea correcta y use dobles backslashes `\\`
- Asegurate de que `tsx.cmd` exista en `node_modules/.bin/`
- Reiniciá Antigravity completamente después de guardar el config


---

## 👤 Autor

**Joaquin Gonzalez**
GitHub: [@JoaquinG-eng](https://github.com/JoaquinG-eng)