import { z } from "zod";
import { closeIssueSchema, CloseIssueInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { closeIssueSchema };

export async function closeIssueTool(input: CloseIssueInput) {
  const parsed = closeIssueSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, issue_number } = parsed.data;

  try {
    logger.info("Cerrando issue", { owner, repo, issue_number });

    const response = await octokit.issues.update({
      owner,
      repo,
      issue_number,
      state: "closed",
    });

    logger.debug("Issue cerrado exitosamente", { owner, repo, issue_number });

    return {
      error: false,
      issue: {
        id: response.data.id,
        number: response.data.number,
        title: response.data.title,
        state: response.data.state,
        url: response.data.html_url,
        closedAt: response.data.closed_at,
      },
    };
  } catch (error) {
    logger.error("Error al cerrar issue", { owner, repo, issue_number, error });
    throw handleGitHubError(error, `${owner}/${repo}#${issue_number}`);
  }
}