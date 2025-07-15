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
    } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
    return null;
}

export async function authenticatedFetch(url: string, options: any = {}, setError?: (msg: string) => void) {
    let response;
    try {
        response = await apiFetch(url, options);
    } catch (err) {
        if (setError) setError("Erro de rede ou servidor. Tente novamente mais tarde.");
        return null;
    }
    if (response && (response.status === 401 || response.status === 403)) {
        if (response.status === 401) {
            const token = await refreshAccessToken();
            if (token) {
                try {
                    response = await apiFetch(url, options);
                } catch (err) {
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
        } catch { }
        if (setError) setError(errorMsg);
        return null;
    }
    return response;
}
