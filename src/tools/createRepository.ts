import { z } from "zod";
import { createRepositorySchema, CreateRepositoryInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { createRepositorySchema };

export async function createRepositoryTool(input: CreateRepositoryInput) {
  const parsed = createRepositorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { name, description, isPrivate } = parsed.data;

  try {
    logger.info("Creando repositorio", { name, isPrivate });

    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: true,
    });

    logger.debug("Repositorio creado exitosamente", { name });

    return {
      error: false,
      repository: {
        id: response.data.id,
        name: response.data.name,
        fullName: response.data.full_name,
        url: response.data.html_url,
        private: response.data.private,
        description: response.data.description ?? "",
        createdAt: response.data.created_at,
      },
    };
  } catch (error) {
    logger.error("Error al crear repositorio", { name, error });
    throw handleGitHubError(error, name);
  }
}