import { z } from "zod";
import { createBranchSchema, CreateBranchInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { createBranchSchema };

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