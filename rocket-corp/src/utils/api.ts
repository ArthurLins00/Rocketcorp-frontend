export async function apiFetch(url: string, options: RequestInit = {}) {
    url = import.meta.env.VITE_API_URL + url;
    const token = localStorage.getItem("access_token");
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers });
    return response;
}
