import type { Equalizacao } from "../../types/Equalizacao";

// const STORAGE_KEY = "equalizacoes";

// TODO: Move to .env or config
const API_URL = "http://localhost:3000/equalizacao/ciclo/1";
const API_URL_CREATE = "http://localhost:3000/equalizacao";

export async function getEqualizacoes(): Promise<Equalizacao[]> {
  try {
    // console.log("[DEBUG] Fetching equalizacoes from:", API_URL);
    const response = await fetch(API_URL);
    // console.log("[DEBUG] Response status:", response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      // console.error("[DEBUG] Error body:", errorBody);
      throw new Error(
        `Erro ao buscar equalizações: ${response.status} - ${errorBody}`
      );
    }
    const data = await response.json();
    // console.log("[DEBUG] Data received:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar equalizações do backend:", error);
    // Optionally fallback to mock data
    // return mockEqualizacoes;
    throw error;
  }
}

export async function salvarEqualizacaoAtualizada(
  equalizacaoAtualizada: Equalizacao
) {
  // This should be replaced with a real backend update call
  // For now, just log the update
  // console.log("Salvar equalizacao atualizada:", equalizacaoAtualizada);
  // Example:
  // await fetch(`/api/equalizacoes/${equalizacaoAtualizada.idEqualizacao}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(equalizacaoAtualizada),
  // });
}

export async function enviarEqualizacaoParaBackend(equalizacao: Equalizacao) {
  try {
    // Ensure all values are properly typed and not null
    const createDto = {
      idCiclo: 1,
      idAvaliador: parseInt(equalizacao.idAvaliador),
      idAvaliado: parseInt(equalizacao.idAvaliado),
      notaFinal: equalizacao.notaFinal ?? 0, // Ensure it's not null
      justificativa: equalizacao.justificativa || "",
    };

    console.log("Sending CreateEqualizacaoDto:", createDto);
    console.log("JSON body:", JSON.stringify(createDto));
    console.log("Request URL:", API_URL_CREATE);

    // Copy this JSON for Postman testing:
    console.log("=== COPY THIS FOR POSTMAN ===");
    console.log(JSON.stringify(createDto, null, 2));
    console.log("=== END POSTMAN JSON ===");

    const response = await fetch(API_URL_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createDto),
    });

    console.log("Response status:", response.status);

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      console.error("Full error response:", responseText);
      throw new Error(
        `Erro ao salvar equalização: ${response.status} - ${responseText}`
      );
    }

    // Try to parse as JSON if it's not empty
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.warn("Response is not valid JSON:", responseText);
      result = { message: "Equalização salva com sucesso" };
    }

    console.log("Equalização salva com sucesso:", result);
    return result;
  } catch (error) {
    console.error("Erro ao enviar equalização para backend:", error);
    throw error;
  }
}
