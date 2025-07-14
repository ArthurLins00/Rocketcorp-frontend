type EditData = {
  dataAberturaAvaliacao: string;
  dataFechamentoAvaliacao: string;
  dataAberturaRevisaoGestor: string;
  dataFechamentoRevisaoGestor: string;
  dataAberturaRevisaoComite: string;
  dataFechamentoRevisaoComite: string;
  dataFinalizacao: string;
};

export async function getAllCycles() {
  const response = await fetch(`http://localhost:3000/cicle`);
  if (!response.ok) {
    throw new Error("Erro ao buscar ciclos");
  }
  return response.json();
}

export async function editCycles(cycleId: number, data: Partial<EditData>) {
  const response = await fetch(`http://localhost:3000/cicle/${cycleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Erro ao editar ciclo");
  }
  // Se for 204, não tem corpo para dar response.json()
  if (response.status === 204) {
    return;
  }
  return response.json();
}

export async function getUsersByCycle(cycleId: number) {
  const response = await fetch(`http://localhost:3000/cicle/${cycleId}/users`);
  if (!response.ok) {
    throw new Error("Erro ao buscar ciclos");
  }
  return response.json();
}

export async function getAllUsers() {
  const response = await fetch(`http://localhost:3000/users`);
  if (!response.ok) {
    throw new Error("Erro ao buscar ciclos");
  }
  return response.json();
}
