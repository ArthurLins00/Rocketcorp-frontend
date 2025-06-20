export async function enviarAvaliacao(dados: any) {
    const response = await fetch("/api/enviar-avaliacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao enviar avaliação");
    }
  
    return response;
  }