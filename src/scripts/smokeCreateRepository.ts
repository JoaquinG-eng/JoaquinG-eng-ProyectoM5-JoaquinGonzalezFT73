import { createRepositoryTool } from "../tools/createRepository.js";

async function main() {
console.log("=== Smoke test: createRepositoryTool ===\n");


const resultado = await createRepositoryTool({
name: "test-mcp-repo",
description: "Repositorio de prueba creado por MCP",
isPrivate: false,
});
console.log("Repositorio creado:", resultado);


const invalido = await createRepositoryTool({ name: "x", description: "", isPrivate: false });
console.log("\nInput inválido:", invalido);
}

main();