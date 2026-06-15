export interface GitHubRepositorio {
    Id: number;
    Name: string;
    FullName: string | null;
    Dueño: {
        Login: string;
        Id: number;
        FotoUrl: string;
        HtmlUrl: string;
    };
    DefaultBranch: string;
    HtmlUrl: string;
    Description: string;
    Fork: boolean; 
    Url: string;
    CreatedAt: string;
    UpdatedAt: string;
    PushedAt: string;
    StargazersCount: number; 
    WatchersCount: number;
    Lenguaje: string;
    }

export interface RepositorioResumen  {
    Id: number;
    Name: string;
    FullName: string | null;
    descripción: string | null;
    Url: string;
    Stars: number;
}




export interface informacionUsuario {
    Login: string;
    Id: number;
HtmlUrl: string;
Name: string;
Company: string | null;
Blog: string | null;
Location: string;
Email: string;
Bio: string | null;
PublicRepos: number; 
Followers: number;  
Following: number;
CreatedAt: string; 
UpdatedAt: string; 
}

export interface GitHubCommitDetallado {
    sha: string;
    name: string;
    message: string;
    athor: {
        name: string;
        email: string;
        date: string;
    };
    url: string;
}


export interface ResumenCommit {
        sha: string;
        message: string;
        author: string;
        url: string;
    }



export interface GitHubIssue {
    Id: number;
    Title: string;
    Estado: "Abierto" | "Cerrado";
    Usuario: string; 
    Url: string;
    CreatedAt: string;
    UpdatedAt: string; 

}

export interface ResumenIssue {
    Id: number;
    Title: string;
    Estado: "Abierto" | "Cerrado";
    Usuario: string; 
    Url: string;
}

export interface GitHubPullRequest {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'closed' | 'merged' | 'draft';
    author: {
        id: number;
        username: string;
        avatarUrl: string;
    };
    sourceBranch: string;
    targetBranch: string;
    url: string;
    repositoryName: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    isDraft: boolean; 
}

export interface ResumenPullRequest {
    id: number;
    title: string;
    status: 'open' | 'closed' | 'merged' | 'draft';
    }

export interface GitHubToolError {
  message: string;
  documentationUrl: string;
  code:
    | "NotFound"
    | "Unauthorized"
    | "ValidationFailed"
    | "ServerError"
    | "RATE_LIMIT_EXCEEDED"
    | "AUTHENTICATION_ERROR"
    | "UNKNOWN_ERROR";
}






