// src/services/trilhaService.ts
import type { TrilhaCompleta } from "../pages/rh/CriteriaManagementPage"; // ajuste o caminho conforme seu projeto

const API_URL = "/api/trilhas"; // endpoint da API (fictício)

export async function buscarTrilhasDoBackend(): Promise<TrilhaCompleta[]> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Falha ao buscar trilhas do backend");
  return await response.json();
}

export async function enviarTrilhasParaBackend(trilhas: TrilhaCompleta[]): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trilhas),
  });
  if (!response.ok) throw new Error("Falha ao salvar trilhas no backend");
}
