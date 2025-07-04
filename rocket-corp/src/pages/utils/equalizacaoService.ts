import type { Equalizacao } from "../../types/Equalizacao";
import { mockEqualizacoes } from "../../mocks/mockEqualizacoes";

const STORAGE_KEY = "equalizacoes";

export function getEqualizacoes(): Equalizacao[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEqualizacoes));
  return mockEqualizacoes;
}

export function salvarEqualizacaoAtualizada(equalizacaoAtualizada: Equalizacao) {
  const existentes = getEqualizacoes();
  const atualizadas = existentes.map((eq) =>
    eq.idEqualizacao === equalizacaoAtualizada.idEqualizacao ? equalizacaoAtualizada : eq
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
}

export async function enviarEqualizacaoParaBackend(equalizacao: Equalizacao) {
  // await fetch('/api/equalizacoes', {
  //   method: 'PUT',
  //   body: JSON.stringify(equalizacao),
  //   headers: { 'Content-Type': 'application/json' }
  console.log("Preparado para enviar ao back:", equalizacao);
}
