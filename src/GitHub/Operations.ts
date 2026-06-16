import type { GitHubRepositorio, informacionUsuario, GitHubCommitDetallado, GitHubIssues, GitHubPullRequest, GitHubToolError } from "../types";
import { octokit } from "./Clients";

export async function obtenerRepositoriosUsuario(
  username: string
): Promise<GitHubRepositorio[]> {
  try {
    const response = await octokit.repos.listForUser({
      username,
      per_page: 100,
    });
    return response.data.map((repo): GitHubRepositorio => ({
      Id: repo.id,
      Name: repo.name,
      FullName: repo.full_name,
      Dueño: {
        Login: repo.owner?.login ?? "",
        Id: repo.owner?.id ?? 0,
        FotoUrl: repo.owner?.avatar_url ?? "",
        HtmlUrl: repo.owner?.html_url ?? "",
      },
      DefaultBranch: repo.default_branch ?? "",
      HtmlUrl: repo.html_url,
      Description: repo.description ?? "",
      Fork: repo.fork,
      Url: repo.url,
      CreatedAt: repo.created_at ?? "",
      UpdatedAt: repo.updated_at ?? "",
      PushedAt: repo.pushed_at ?? "",
      StargazersCount: repo.stargazers_count ?? 0,
      WatchersCount: repo.watchers_count ?? 0,
      Lenguaje: repo.language ?? "",
    }));
  } catch (error) {
    console.error("Error al obtener repositorios:", error);
    throw handleGitHubError(error);
  }
}


export async function obtenerInformacionUsuario(
  username: string
): Promise<informacionUsuario> {
  try {
    const response = await octokit.users.getByUsername({ username });
    const user = response.data;
    return {
      Login: user.login,
      Id: user.id,
      HtmlUrl: user.html_url,
      Name: user.name ?? "",
      Company: user.company ?? "",
      Blog: user.blog ?? "",
      Location: user.location ?? "",
      Email: user.email ?? "",
      Bio: user.bio ?? "",
      PublicRepos: user.public_repos,
      Followers: user.followers,
      Following: user.following,
      CreatedAt: user.created_at,
      UpdatedAt: user.updated_at,
    };
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    throw handleGitHubError(error);
  }
}


export async function GitHubCommitDetallado(
  owner: string,
  repo: string
): Promise<GitHubCommitDetallado[]> {
  try {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100,
    });
    return response.data.map((commit): GitHubCommitDetallado => ({
      sha: commit.sha,
      name: commit.commit.author?.name ?? "",
      message: commit.commit.message,
      athor: {
        name: commit.commit.author?.name ?? "",
        email: commit.commit.author?.email ?? "",
        date: commit.commit.author?.date ?? "",
      },
      url: commit.html_url,
    }));
  } catch (error) {
    console.error("Error al obtener commits detallados:", error);
    throw handleGitHubError(error);
  }
}


export async function GitHubIssues(
  owner: string,
  repo: string
): Promise<GitHubIssues[]> {
  try {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      per_page: 100,
    });
    return response.data.map((issue): GitHubIssues => ({
      Id: issue.id,
      Title: issue.title,
      Estado: issue.state === "open" ? "Abierto" : "Cerrado",
      Usuario: issue.user?.login ?? "",
      Url: issue.html_url,
      CreatedAt: issue.created_at,
      UpdatedAt: issue.updated_at,
    }));
  } catch (error) {
    console.error("Error al obtener issues:", error);
    throw handleGitHubError(error);
  }
}


export async function GitHubPullRequests(
  owner: string,
  repo: string,
): Promise<GitHubPullRequest[]> {
  try {
    const response = await octokit.pulls.list({
      owner,
      repo,
      per_page: 100,
    });
    return response.data.map((pr): GitHubPullRequest => ({
      id: pr.number,
      title: pr.title,
      description: pr.body ?? "",
      status: pr.draft ? "draft" : pr.state === "closed"
        ? (pr.merged_at ? "merged" : "closed")
        : "open",
      author: {
        id: pr.user?.id ?? 0,
        username: pr.user?.login ?? "",
        avatarUrl: pr.user?.avatar_url ?? "",
      },
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      url: pr.html_url,
      repositoryName: pr.base.repo.name,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      isDraft: pr.draft ?? false,
    }));
  } catch (error) {
    console.error("Error al obtener pull requests:", error);
    throw handleGitHubError(error);
  }
}


export function handleGitHubError(error: unknown): GitHubToolError {
  if (error instanceof Error) {
    const message = error.message;
    const status = (error as any).status;

    if (status === 401) {
      return { message, documentationUrl: "https://docs.github.com/rest", code: "AUTHENTICATION_ERROR" };
    }
    if (status === 404) {
      return { message, documentationUrl: "https://docs.github.com/rest", code: "NotFound" };
    }
    if (status === 422) {
      return { message, documentationUrl: "https://docs.github.com/rest", code: "ValidationFailed" };
    }
    if (status === 429) {
      return { message, documentationUrl: "https://docs.github.com/rest", code: "RATE_LIMIT_EXCEEDED" };
    }
    if (status >= 500) {
      return { message, documentationUrl: "https://docs.github.com/rest", code: "ServerError" };
    }

    return { message, documentationUrl: "https://docs.github.com/rest", code: "UNKNOWN_ERROR" };
  }

  return {
    message: "An unknown error occurred",
    documentationUrl: "https://docs.github.com/rest",
    code: "UNKNOWN_ERROR",
  };
}