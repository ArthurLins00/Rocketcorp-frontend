import type { Equalizacao } from "../types/Equalizacao";

// const STORAGE_KEY = "equalizacoes";

// TODO: Move to .env or config
const API_URL = "http://localhost:3000/equalizacao/current-cycle";
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
  try {
    // Validate and ensure required fields have valid values
    const notaFinal = equalizacaoAtualizada.notaFinal ?? 0.1;
    const justificativa =
      (equalizacaoAtualizada.justificativa || "").trim() ||
      "Equalização atualizada";

    // Ensure notaFinal is a positive number (minimum 0.1)
    const notaFinalValidada = notaFinal > 0 ? notaFinal : 0.1;

    // Create the UpdateEqualizacaoDto
    const updateDto = {
      id: parseInt(equalizacaoAtualizada.idEqualizacao),
      notaFinal: notaFinalValidada,
      justificativa: justificativa,
    };

    console.log("Sending UpdateEqualizacaoDto:", updateDto);
    console.log("JSON body:", JSON.stringify(updateDto));
    console.log("Request URL:", API_URL_CREATE);

    const response = await fetch(API_URL_CREATE, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateDto),
    });

    console.log("Response status:", response.status);

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      console.error("Full error response:", responseText);
      throw new Error(
        `Erro ao atualizar equalização: ${response.status} - ${responseText}`
      );
    }

    // Try to parse as JSON if it's not empty
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      console.warn("Response is not valid JSON:", responseText);
      result = { message: "Equalização atualizada com sucesso" };
    }

    console.log("Equalização atualizada com sucesso:", result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Erro ao atualizar equalização no backend:", error);
    throw error;
  }
}

export async function enviarEqualizacaoParaBackend(equalizacao: Equalizacao) {
  try {
    // Validate and ensure all values are properly typed and not null
    const notaFinal = equalizacao.notaFinal ?? 0.1;
    const justificativa =
      (equalizacao.justificativa || "").trim() || "Equalização criada";

    // Ensure notaFinal is a positive number (minimum 0.1)
    const notaFinalValidada = notaFinal > 0 ? notaFinal : 0.1;

    const createDto = {
      idCiclo: parseInt(equalizacao.idCiclo),
      idAvaliador: parseInt(equalizacao.idAvaliador),
      idAvaliado: parseInt(equalizacao.idAvaliado),
      notaFinal: notaFinalValidada,
      justificativa: justificativa,
    };

    // console.log("Sending CreateEqualizacaoDto:", createDto);
    // console.log("JSON body:", JSON.stringify(createDto));
    // console.log("Request URL:", API_URL_CREATE);

    // Copy this JSON for Postman testing:
    // console.log("=== COPY THIS FOR POSTMAN ===");
    // console.log(JSON.stringify(createDto, null, 2));
    // console.log("=== END POSTMAN JSON ===");

    const response = await fetch(API_URL_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createDto),
    });

    // console.log("Response status:", response.status);

    const responseText = await response.text();
    // console.log("Raw response:", responseText);

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
    } catch {
      console.warn("Response is not valid JSON:", responseText);
      result = { message: "Equalização salva com sucesso" };
    }

    // console.log("Equalização salva com sucesso:", result);

    // Return the ID from the backend response
    return {
      success: true,
      id: result?.id || result?.idEqualizacao || null,
      data: result,
    };
  } catch (error) {
    console.error("Erro ao enviar equalização para backend:", error);
    throw error;
  }
}
