
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL_IMPORT = `${API_BASE_URL}/import`;

// Serviço para importar arquivos de histórico

export async function importarHistorico(files: File[]): Promise<Response> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("files", file);
  });

  // Substitua a URL abaixo pelo endpoint real do backend, se necessário
  return fetch(API_URL_IMPORT, {
    method: "POST",
    body: formData,
  });
}   