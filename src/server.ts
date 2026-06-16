import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listRepositoriesTool, listRepositoriesSchema } from "./tools/listRepositories.js";
import { listIssuesTool, listIssuesSchema } from "./tools/listissues.js";
import { listCommitsTool, listCommitsSchema } from "./tools/listCommits.js";
import { createRepositoryTool, createRepositorySchema } from "./tools/createRepository.js";
import { createIssueTool, createIssueSchema } from "./tools/createIssue.js";
import { createCommitTool, createCommitSchema } from "./tools/createCommit.js";

const server = new McpServer({
  name: "github-ai-agent",
  version: "1.0.0",
});

server.tool(
  "list_repositories",
  "Lista todos los repositorios públicos de un usuario de GitHub",
  listRepositoriesSchema.shape,
  async (input) => {
    const result = await listRepositoriesTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "list_issues",
  "Lista los issues de un repositorio de GitHub",
  listIssuesSchema.shape,
  async (input) => {
    const result = await listIssuesTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "list_commits",
  "Lista los commits recientes de un repositorio de GitHub",
  listCommitsSchema.shape,
  async (input) => {
    const result = await listCommitsTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_repository",
  "Crea un nuevo repositorio en GitHub para el usuario autenticado",
  createRepositorySchema.shape,
  async (input) => {
    const result = await createRepositoryTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_issue",
  "Abre un nuevo issue en un repositorio de GitHub",
  createIssueSchema.shape,
  async (input) => {
    const result = await createIssueTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "create_commit",
  "Crea o modifica un archivo y hace commit en un repositorio de GitHub",
  createCommitSchema.shape,
  async (input) => {
    const result = await createCommitTool(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ GitHub MCP Server corriendo via stdio");
}

main();