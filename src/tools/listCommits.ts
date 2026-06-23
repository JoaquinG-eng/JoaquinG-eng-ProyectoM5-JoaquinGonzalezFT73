import { z } from "zod";
import { listCommitsSchema, ListCommitsInput } from "../schemas/Schemas.js";
import { GitHubCommitDetallado } from "../GitHub/Operations.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { listCommitsSchema };

export async function listCommitsTool(input: ListCommitsInput) {
  const parsed = listCommitsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo } = parsed.data;

  try {
    logger.info("Listando commits", { owner, repo });
    const commits = await GitHubCommitDetallado(owner, repo);
    logger.debug("Commits listados", { owner, repo, count: commits.length });

    return {
      error: false,
      count: commits.length,
      commits: commits.map((commit) => ({
        sha: commit.sha,
        message: commit.message,
        author: commit.athor.name,
        date: commit.athor.date,
        url: commit.url,
      })),
    };
  } catch (error) {
    logger.error("Error al listar commits", { owner, repo, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}