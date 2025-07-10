export async function getCycle(idCycle: number) {
  const response = await fetch(`http://localhost:3000/users/${idCycle}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar ciclo");
  }
  return response.json();
}
