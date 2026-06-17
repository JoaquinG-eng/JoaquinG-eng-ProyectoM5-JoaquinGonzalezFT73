import { z } from "zod";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export const createPullRequestSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner no puede estar vacío")
    .max(39, "El owner no puede superar 39 caracteres"),
  repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(256, "El título no puede superar 256 caracteres"),
  body: z
    .string()
    .max(65536, "El cuerpo no puede superar 65536 caracteres")
    .optional()
    .default(""),
  head: z
    .string()
    .min(1, "La branch origen no puede estar vacía"),
  base: z
    .string()
    .optional()
    .default("main"),
  draft: z
    .boolean()
    .optional()
    .default(false),
});

export type CreatePullRequestInput = z.infer<typeof createPullRequestSchema>;

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