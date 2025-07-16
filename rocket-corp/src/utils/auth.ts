import { apiFetch } from "./api";

export async function refreshAccessToken() {
    try {
        const response = await apiFetch("/auth/refresh", {
            method: "POST",
            credentials: "include",
        });
        if (response && response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            return data.access_token;
        } else if (response && response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    return null;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}, setError?: (msg: string) => void) {
    let response;
    try {
        response = await apiFetch(url, options);
    } catch (error) {
        console.error("Network error:", error);
        if (setError) setError("Erro de rede ou servidor. Tente novamente mais tarde.");
        return null;
    }
    if (response && (response.status === 401 || response.status === 403)) {
        if (response.status === 401) {
            const token = await refreshAccessToken();
            if (token) {
                try {
                    response = await apiFetch(url, options);
                } catch (error) {
                    console.error("Error after token refresh:", error);
                    if (setError) setError("Erro de rede ou servidor após tentar renovar o acesso.");
                    return null;
                }
            } else {

                return null;
            }
        } else if (response.status === 403) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            if (setError) setError("Acesso negado. Você não tem permissão para acessar este recurso.");
            console.log("Acesso negado. Redirecionando para login.");
            window.location.href = "/login";
            return null;
        }
    }
    if (response && !response.ok) {
        let errorMsg = "Erro inesperado do servidor.";
        try {
            const data = await response.json();
            if (data && data.message) errorMsg = data.message;
        } catch (error) {
            console.error("Error parsing error response:", error);
        }
        if (setError) setError(errorMsg);
        return null;
    }
    return response;
}

/**
 * Retorna o usuário logado do localStorage já parseado, ou null se não houver.
 */
export function getUsuarioLogado() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

/**
 * Limpa todos os dados de avaliação do localStorage para o usuário atual
 */
export function clearUserEvaluationData() {
  const user = getUsuarioLogado();
  if (!user) return;

  // Limpar dados de avaliação específicos do usuário
  localStorage.removeItem("autoavaliacao");
  localStorage.removeItem("avaliacao360");
  localStorage.removeItem("mentoring");
  localStorage.removeItem("referencias");
  
  console.log("🧹 Dados de avaliação limpos para o usuário:", user.name);
}

/**
 * Limpa todos os dados do usuário do localStorage
 */
export function clearAllUserData() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("autoavaliacao");
  localStorage.removeItem("avaliacao360");
  localStorage.removeItem("mentoring");
  localStorage.removeItem("referencias");
  
  console.log("🧹 Todos os dados do usuário foram limpos");
}
