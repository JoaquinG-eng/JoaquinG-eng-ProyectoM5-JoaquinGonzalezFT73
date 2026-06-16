import { handleGitHubError } from "../GitHub/Operations.js";

async function main() {
  console.log("=== Smoke test: handleGitHubError ===\n");

  // 401 - AUTHENTICATION_ERROR
  const error401 = Object.assign(new Error("Unauthorized"), { status: 401 });
  console.log("401:", handleGitHubError(error401));

  // 404 - NotFound
  const error404 = Object.assign(new Error("Not Found"), { status: 404 });
  console.log("404:", handleGitHubError(error404));

  // 422 - ValidationFailed
  const error422 = Object.assign(new Error("Validation Failed"), { status: 422 });
  console.log("422:", handleGitHubError(error422));

  // 429 - RATE_LIMIT_EXCEEDED
  const error429 = Object.assign(new Error("Too Many Requests"), { status: 429 });
  console.log("429:", handleGitHubError(error429));

  // 500 - ServerError
  const error500 = Object.assign(new Error("Internal Server Error"), { status: 500 });
  console.log("500:", handleGitHubError(error500));

  // Error genérico sin status - UNKNOWN_ERROR
  const errorGenerico = new Error("Something went wrong");
  console.log("Generic:", handleGitHubError(errorGenerico));

  // No es instancia de Error - UNKNOWN_ERROR
  console.log("Non-Error:", handleGitHubError("string error"));
  console.log("Null:", handleGitHubError(null));

  console.log("\n✅ Smoke test completado");
}

main();