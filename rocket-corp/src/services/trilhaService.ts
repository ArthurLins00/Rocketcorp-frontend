import type {
  Trilha,
  Criterio,
  CriterioCreateRequest,
  CriterioUpdateRequest,
  CriterioBulkRequest,
} from "../mocks/trilhasMock";

//colocar um .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL_GET_TRILHAS = `${API_BASE_URL}/trilha/with-criterios-grouped`;
const API_URL_CRITERIO_BULK = `${API_BASE_URL}/criterio/bulk`;

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

export async function enviarCriterios(criterios: Criterio[]): Promise<void> {
  // Filter only criterios that have been modified or need to be updated
  const criteriosToUpdate = criterios.filter(
    (criterio) =>
      // Only send existing criterios (with numeric IDs) that have been modified
      typeof criterio.id === "number" && criterio.isModified
  );

  if (criteriosToUpdate.length === 0) {
    console.log("No criterios to update");
    return;
  }

  // Create the update DTO with only the fields that should be sent
  const updateRequest: CriterioBulkRequest = {
    criterios: criteriosToUpdate.map((criterio) => {
      const update: CriterioUpdateRequest = {
        id: criterio.id as number, // We know it's a number for existing criterios
      };

      // Only include fields that are not empty/undefined
      if (criterio.name && criterio.name.trim()) {
        update.name = criterio.name;
      }

      if (criterio.tipo && criterio.tipo.trim()) {
        update.tipo = criterio.tipo;
      }

      if (criterio.peso !== undefined && criterio.peso !== null) {
        update.peso = criterio.peso;
      }

      if (criterio.description && criterio.description.trim()) {
        update.description = criterio.description;
      }

      if (criterio.enabled !== undefined && criterio.enabled !== null) {
        update.enabled = criterio.enabled;
      }

      return update;
    }),
  };

  console.log("Sending criterios update:", updateRequest);

  const response = await fetch(API_URL_CRITERIO_BULK, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateRequest),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to update criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(
      `Falha ao atualizar critérios no backend. Status: ${response.status}`
    );
  }
}

function isNewCriterio(criterio: Criterio): boolean {
  return typeof criterio.id === "string" || criterio.isNew === true;
}

function isModifiedCriterio(criterio: Criterio): boolean {
  return criterio.isModified === true;
}

// Helper function to get idCiclo from existing criterios in a trilha
function getIdCicloFromTrilha(trilha: Trilha): number {
  // Look for any existing criterio in the trilha to get the idCiclo
  for (const criterios of Object.values(trilha.criteriosGrouped)) {
    for (const criterio of criterios) {
      if (typeof criterio.id === "number" && criterio.idCiclo) {
        return criterio.idCiclo;
      }
    }
  }
  // Fallback to 1 if no existing criterios found
  return 1;
}

export async function criarCriteriosBulk(
  criterios: Criterio[],
  trilhaId: number,
  idCiclo: number
): Promise<Criterio[]> {
  const newCriterios = criterios.filter(isNewCriterio);

  if (newCriterios.length === 0) {
    return [];
  }

  const createRequest: CriterioBulkRequest = {
    criterios: newCriterios.map(
      (criterio): CriterioCreateRequest => ({
        name: criterio.name,
        tipo: criterio.tipo,
        peso: criterio.peso,
        description: criterio.description,
        idCiclo,
        trilhaId,
        enabled: criterio.enabled,
      })
    ),
  };

  const response = await fetch(API_URL_CRITERIO_BULK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createRequest),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to create criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(`Falha ao criar critérios. Status: ${response.status}`);
  }

  return await response.json();
}

export async function atualizarCriteriosBulk(
  criterios: Criterio[]
): Promise<Criterio[]> {
  const modifiedCriterios = criterios.filter(
    (criterio) => !isNewCriterio(criterio) && isModifiedCriterio(criterio)
  );

  if (modifiedCriterios.length === 0) {
    return [];
  }

  const updateRequest: CriterioBulkRequest = {
    criterios: modifiedCriterios.map((criterio): CriterioUpdateRequest => {
      const update: CriterioUpdateRequest = {
        id: criterio.id as number,
      };

      if (criterio.name) update.name = criterio.name;
      if (criterio.tipo) update.tipo = criterio.tipo;
      if (criterio.peso !== undefined) update.peso = criterio.peso;
      if (criterio.description) update.description = criterio.description;
      if (criterio.enabled !== undefined) update.enabled = criterio.enabled;

      return update;
    }),
  };

  const response = await fetch(API_URL_CRITERIO_BULK, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateRequest),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `Failed to update criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(`Falha ao atualizar critérios. Status: ${response.status}`);
  }

  return await response.json();
}

export async function salvarCriteriosBulk(trilhas: Trilha[]): Promise<void> {
  try {
    const allOperations: Promise<Criterio[]>[] = [];

    for (const trilha of trilhas) {
      const idCiclo = getIdCicloFromTrilha(trilha);

      for (const criterios of Object.values(trilha.criteriosGrouped)) {
        const createPromise = criarCriteriosBulk(criterios, trilha.id, idCiclo);
        allOperations.push(createPromise);

        const updatePromise = atualizarCriteriosBulk(criterios);
        allOperations.push(updatePromise);
      }
    }

    await Promise.all(allOperations);

    console.log("All criterios saved successfully");
  } catch (error) {
    console.error("Error saving criterios:", error);
    throw error;
  }
}

export async function removerCriterio(criterioId: number) {
  const response = await fetch(`${API_BASE_URL}/criterio/${criterioId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ao remover critério: ${errorBody}`);
  }
}
