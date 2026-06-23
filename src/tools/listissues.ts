import { z } from "zod";
import { listIssuesSchema, ListIssuesInput } from "../schemas/Schemas.js";
import { GitHubIssues } from "../GitHub/Operations.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { listIssuesSchema };

export async function listIssuesTool(input: ListIssuesInput) {
  const parsed = listIssuesSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo } = parsed.data;

  try {
    logger.info("Listando issues", { owner, repo });
    const issues = await GitHubIssues(owner, repo);
    logger.debug("Issues listados", { owner, repo, count: issues.length });

    return {
      error: false,
      count: issues.length,
      issues: issues.map((issue) => ({
        id: issue.Id,
        title: issue.Title,
        estado: issue.Estado,
        usuario: issue.Usuario,
        url: issue.Url,
        createdAt: issue.CreatedAt,
        updatedAt: issue.UpdatedAt,
      })),
    };
  } catch (error) {
    logger.error("Error al listar issues", { owner, repo, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}