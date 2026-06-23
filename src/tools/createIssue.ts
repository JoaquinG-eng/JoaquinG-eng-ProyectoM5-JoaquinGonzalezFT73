import { z } from "zod";
import { createIssueSchema, CreateIssueInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { createIssueSchema };

export async function createIssueTool(input: CreateIssueInput) {
  const parsed = createIssueSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, title, body } = parsed.data;

  try {
    logger.info("Creando issue", { owner, repo, title });

    const response = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
    });

    logger.debug("Issue creado exitosamente", { owner, repo, number: response.data.number });

    return {
      error: false,
      issue: {
        id: response.data.id,
        number: response.data.number,
        title: response.data.title,
        body: response.data.body ?? "",
        state: response.data.state,
        url: response.data.html_url,
        createdAt: response.data.created_at,
      },
    };
  } catch (error) {
    logger.error("Error al crear issue", { owner, repo, title, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}