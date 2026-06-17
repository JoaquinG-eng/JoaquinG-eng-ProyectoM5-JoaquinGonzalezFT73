import { z } from "zod";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export const createBranchSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner no puede estar vacío")
    .max(39, "El owner no puede superar 39 caracteres"),
  repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
  branchName: z
    .string()
    .min(1, "El nombre de la branch no puede estar vacío")
    .max(255, "El nombre de la branch no puede superar 255 caracteres")
    .regex(/^[a-zA-Z0-9._/-]+$/, "Nombre de branch inválido"),
  fromBranch: z
    .string()
    .optional()
    .default("main"),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;

export async function createBranchTool(input: CreateBranchInput) {
  const parsed = createBranchSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, branchName, fromBranch } = parsed.data;

  try {
    logger.info("Creando branch", { owner, repo, branchName, fromBranch });

    // Obtener el SHA de la branch origen
    const baseBranch = await octokit.repos.getBranch({ owner, repo, branch: fromBranch });
    const sha = baseBranch.data.commit.sha;

    const response = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });

    logger.debug("Branch creada exitosamente", { owner, repo, branchName });

    return {
      error: false,
      branch: {
        name: branchName,
        ref: response.data.ref,
        sha: response.data.object.sha,
        url: `https://github.com/${owner}/${repo}/tree/${branchName}`,
      },
    };
  } catch (error) {
    logger.error("Error al crear branch", { owner, repo, branchName, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}