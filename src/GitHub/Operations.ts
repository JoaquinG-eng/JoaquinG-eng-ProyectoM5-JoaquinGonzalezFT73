import type { GitHubRepositorio, informacionUsuario  } from "../types";
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
    throw error;
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
    throw error;
  }
}