// src/services/trilhaService.ts

import type { Trilha } from "../mocks/trilhasMock";

//colocar um .env
const API_URL_GET_TRILHAS =
  "http://localhost:3000/trilha/with-criterios-grouped";
const API_URL_POST_TRILHAS = "http://localhost:3000/trilha";

export async function buscarTrilhasDoBackend(): Promise<Trilha[]> {
  const response = await fetch(API_URL_GET_TRILHAS);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to fetch trilhas: ${response.status} - ${errorBody}`);
    throw new Error(
      `Falha ao buscar trilhas do backend. Status: ${response.status}`
    );
  }
  return await response.json();
}

export async function enviarTrilhasParaBackend(
  trilhas: Trilha[]
): Promise<void> {
  const response = await fetch(API_URL_POST_TRILHAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trilhas),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Failed to save trilhas: ${response.status} - ${errorBody}`);
    throw new Error(
      `Falha ao salvar trilhas no backend. Status: ${response.status}`
    );
  }
}
