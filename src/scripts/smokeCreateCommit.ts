import { createCommitTool } from "../tools/createCommit.js";

async function main() {
  console.log("=== Smoke test: createCommitTool ===\n");

  // ✅ Caso exitoso
  const resultado = await createCommitTool({
    owner: "JoaquinG-eng",
    repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
    message: "test: archivo creado por MCP smoke test",
    filePath: "test-mcp.md",
    fileContent: "# Test MCP\nEste archivo fue creado por el MCP server.",
    branch: "main",
  });

  if (resultado.error) {
    console.log("❌ Error al crear commit:", resultado.message);
  } else {
    console.log("✅ Commit creado exitosamente"); 
    console.log(`   SHA:     ${resultado.commit?.sha}`);
    console.log(`   Mensaje: ${resultado.commit?.message}`); 
    console.log(`   Archivo: ${resultado.commit?.filePath}`);
    console.log(`   URL:     ${resultado.commit?.url}`);
  }

  // ❌ Caso inválido
  console.log("\n--- Validando input inválido ---");
  const invalido = await createCommitTool({
    owner: "",
    repo: "x",
    message: "",
    filePath: "",
    fileContent: "",
    branch: "main",
  });

  if (invalido.error) {
    console.log("✅ Validación correcta:", invalido.message);
  }
}

main();