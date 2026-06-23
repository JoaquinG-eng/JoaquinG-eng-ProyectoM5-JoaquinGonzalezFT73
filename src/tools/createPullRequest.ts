import { z } from "zod";
import { createPullRequestSchema, CreatePullRequestInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { createPullRequestSchema };

export async function createPullRequestTool(input: CreatePullRequestInput) {
  const parsed = createPullRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, title, body, head, base, draft } = parsed.data;

  try {
    logger.info("Creando pull request", { owner, repo, title, head, base });

    const response = await octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
      draft,
    });

    logger.debug("Pull request creado exitosamente", { owner, repo, number: response.data.number });

    return {
      error: false,
      pullRequest: {
        id: response.data.id,
        number: response.data.number,
        title: response.data.title,
        state: response.data.state,
        draft: response.data.draft,
        url: response.data.html_url,
        sourceBranch: response.data.head.ref,
        targetBranch: response.data.base.ref,
        createdAt: response.data.created_at,
      },
    };
  } catch (error) {
    logger.error("Error al crear pull request", { owner, repo, title, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}