import { handleGitHubError } from "../GitHub/Operations.js";

async function main() {
  console.log("=== Smoke test: handleGitHubError ===\n");

  // 401 - ERROR DE AUTENTICACIÓN
  const error401 = Object.assign(new Error("No autorizado"), { status: 401 });
  console.log("401:", handleGitHubError(error401));

  // 404 - NO ENCONTRADO
  const error404 = Object.assign(new Error("No encontrado"), { status: 404 });
  console.log("404:", handleGitHubError(error404, "JoaquinG-eng/mi-repositorio"));

  // 422 - VALIDACIÓN FALLIDA
  const error422 = Object.assign(new Error("El nombre del repositorio es inválido"), { status: 422 });
  console.log("422:", handleGitHubError(error422, "mi repo con espacios"));

  // 429 - LÍMITE DE SOLICITUDES EXCEDIDO
  const error429 = Object.assign(new Error("Demasiadas solicitudes"), { status: 429 });
  console.log("429:", handleGitHubError(error429));

  // 500 - ERROR DEL SERVIDOR
  const error500 = Object.assign(new Error("Error interno del servidor"), { status: 500 });
  console.log("500:", handleGitHubError(error500));

  // Error genérico sin status - ERROR DESCONOCIDO
  const errorGenerico = new Error("Algo salió mal");
  console.log("Genérico:", handleGitHubError(errorGenerico));

  // No es instancia de Error - ERROR DESCONOCIDO
  console.log("No es Error:", handleGitHubError("error de string"));
  console.log("Nulo:", handleGitHubError(null));

  console.log("\n✅ Smoke test completado");
}

main();