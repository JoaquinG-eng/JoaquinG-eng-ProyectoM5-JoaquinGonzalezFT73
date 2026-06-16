import { createIssueTool } from "../tools/createIssue.js";

async function main() {
console.log("=== Smoke test: createIssueTool ===\n");


const resultado = await createIssueTool({
    owner: "JoaquinG-eng",
    repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
    title: "Issue de prueba creado por MCP",
    body: "Este issue fue creado automáticamente por el smoke test del MCP server.",
});
console.log("Issue creado:", resultado);


const invalido = await createIssueTool({ owner: "", repo: "x", title: "", body: "" });
console.log("\nInput inválido:", invalido);
}

main();