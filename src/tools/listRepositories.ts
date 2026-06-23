import { z } from "zod";
import { listRepositoriesSchema, ListRepositoriesInput } from "../schemas/Schemas.js";
import { obtenerRepositoriosUsuario } from "../GitHub/Operations.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { listRepositoriesSchema };

export async function listRepositoriesTool(input: ListRepositoriesInput) {
  const parsed = listRepositoriesSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  try {
    logger.info("Listando repositorios", { username: parsed.data.username });
    const repos = await obtenerRepositoriosUsuario(parsed.data.username);
    logger.debug("Repositorios listados", { count: repos.length });

    return {
      error: false,
      count: repos.length,
      repositories: repos.map((repo) => ({
        id: repo.Id,
        name: repo.Name,
        fullName: repo.FullName,
        description: repo.Description,
        url: repo.HtmlUrl,
        language: repo.Lenguaje,
        stars: repo.StargazersCount,
        defaultBranch: repo.DefaultBranch,
        fork: repo.Fork,
        createdAt: repo.CreatedAt,
        updatedAt: repo.UpdatedAt,
      })),
    };
  } catch (error) {
    logger.error("Error al listar repositorios", { error });
    throw handleGitHubError(error, parsed.data.username);
  }
}