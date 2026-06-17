import { createPullRequestTool } from "../tools/createPullRequest.js";

async function main() {
  console.log("=== Smoke test: createPullRequestTool ===\n");

  // ✅ Caso exitoso
  try {
    const resultado = await createPullRequestTool({
      owner: "JoaquinG-eng",
      repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
      title: "feat: PR de prueba creado por MCP",
      body: "Este PR fue creado automáticamente por el smoke test del MCP server.",
      head: "feature/test-mcp-branch",
      base: "main",
      draft: false,
    });

    if (resultado.error) {
      console.log("❌ Error:", resultado.message);
    } else {
      console.log("✅ Pull Request creado exitosamente");
      console.log(`   Número: #${resultado.pullRequest?.number}`);
      console.log(`   Título: ${resultado.pullRequest?.title}`);
      console.log(`   Estado: ${resultado.pullRequest?.state}`);
      console.log(`   URL:    ${resultado.pullRequest?.url}`);
    }
  } catch (error: any) {
    console.log("❌ Error de GitHub:", error.message);
  }

  // ❌ Input inválido
  console.log("\n--- Validando input inválido ---");
  const invalido = await createPullRequestTool({ owner: "", repo: "x", title: "", body: "", head: "", base: "main", draft: false });
  if (invalido.error) {
    console.log("✅ Validación correcta:", invalido.message);
  }
}

main();