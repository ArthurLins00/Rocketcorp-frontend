type Cycle = {
  id: string | number;
  status: string;
};

export async function buscarCicloAberto(): Promise<Cycle | undefined> {
  const response = await fetch('http://localhost:3000/cicle');
  const ciclos: Cycle[] = await response.json();
  return ciclos.find((c) => c.status === 'aberto');
} 