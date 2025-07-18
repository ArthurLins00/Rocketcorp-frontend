import type {
  Trilha,
  Criterio,
  CriterioCreateRequest,
  CriterioUpdateRequest,
  CriterioBulkRequest,
} from "../mocks/trilhasMock";
import { apiFetch } from "../utils/api";

//colocar um .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL_GET_TRILHAS = `${API_BASE_URL}/trilha/with-criterios-grouped`;
const API_URL_CRITERIO_BULK = `${API_BASE_URL}/criterio/bulk`;

export async function buscarTrilhasDoBackend(): Promise<Trilha[]> {
  console.log("🔍 [trilhaService] Fetching trilhas from:", API_URL_GET_TRILHAS);

  const response = await apiFetch("/trilha/with-criterios-grouped");

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ [trilhaService] Failed to fetch trilhas: ${response.status} - ${errorBody}`
    );
    throw new Error(
      `Falha ao buscar trilhas do backend. Status: ${response.status}`
    );
  }

  const data = await response.json();
  console.log("✅ [trilhaService] Successfully fetched trilhas:", data);
  return data;
}

export async function enviarCriterios(criterios: Criterio[]): Promise<void> {
  console.log(
    "📤 [trilhaService] enviarCriterios called with criterios:",
    criterios
  );

  // Filter only criterios that have been modified or need to be updated
  const criteriosToUpdate = criterios.filter(
    (criterio) =>
      // Only send existing criterios (with numeric IDs) that have been modified
      typeof criterio.id === "number" && criterio.isModified
  );

  console.log(
    "🔧 [trilhaService] Filtered criterios to update:",
    criteriosToUpdate
  );

  if (criteriosToUpdate.length === 0) {
    console.log("⚠️ [trilhaService] No criterios to update");
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

  console.log(
    "📋 [trilhaService] Final DTO being sent to backend:",
    JSON.stringify(updateRequest, null, 2)
  );
  console.log(
    "🌐 [trilhaService] Making PATCH request to:",
    API_URL_CRITERIO_BULK
  );

  const response = await apiFetch("/criterio/bulk", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateRequest),
  });

  console.log("📡 [trilhaService] Response status:", response.status);
  console.log("📡 [trilhaService] Response ok:", response.ok);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ [trilhaService] Failed to update criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(
      `Falha ao atualizar critérios no backend. Status: ${response.status}`
    );
  }

  console.log("✅ [trilhaService] Successfully updated criterios");
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
  console.log("🆕 [trilhaService] criarCriteriosBulk called with:", {
    criterios,
    trilhaId,
    idCiclo,
  });

  const newCriterios = criterios.filter(isNewCriterio);
  console.log("🔍 [trilhaService] Filtered new criterios:", newCriterios);

  if (newCriterios.length === 0) {
    console.log("⚠️ [trilhaService] No new criterios to create");
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

  console.log(
    "📋 [trilhaService] CREATE DTO being sent to backend:",
    JSON.stringify(createRequest, null, 2)
  );
  console.log(
    "🌐 [trilhaService] Making POST request to:",
    API_URL_CRITERIO_BULK
  );

  const response = await apiFetch("/criterio/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createRequest),
  });

  console.log("📡 [trilhaService] CREATE Response status:", response.status);
  console.log("📡 [trilhaService] CREATE Response ok:", response.ok);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ [trilhaService] Failed to create criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(`Falha ao criar critérios. Status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log(
    "✅ [trilhaService] Successfully created criterios:",
    responseData
  );
  return responseData;
}

export async function atualizarCriteriosBulk(
  criterios: Criterio[]
): Promise<Criterio[]> {
  console.log(
    "🔄 [trilhaService] atualizarCriteriosBulk called with criterios:",
    criterios
  );

  const modifiedCriterios = criterios.filter(
    (criterio) => !isNewCriterio(criterio) && isModifiedCriterio(criterio)
  );

  console.log(
    "🔍 [trilhaService] Filtered modified criterios:",
    modifiedCriterios
  );

  if (modifiedCriterios.length === 0) {
    console.log("⚠️ [trilhaService] No modified criterios to update");
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

  console.log(
    "📋 [trilhaService] UPDATE DTO being sent to backend:",
    JSON.stringify(updateRequest, null, 2)
  );
  console.log(
    "🌐 [trilhaService] Making PATCH request to:",
    API_URL_CRITERIO_BULK
  );

  const response = await apiFetch("/criterio/bulk", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateRequest),
  });

  console.log("📡 [trilhaService] UPDATE Response status:", response.status);
  console.log("📡 [trilhaService] UPDATE Response ok:", response.ok);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ [trilhaService] Failed to update criterios: ${response.status} - ${errorBody}`
    );
    throw new Error(`Falha ao atualizar critérios. Status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log(
    "✅ [trilhaService] Successfully updated criterios:",
    responseData
  );
  return responseData;
}

export async function salvarCriteriosBulk(trilhas: Trilha[]): Promise<void> {
  console.log(
    "💾 [trilhaService] salvarCriteriosBulk called with trilhas:",
    trilhas
  );

  try {
    const allOperations: Promise<Criterio[]>[] = [];

    for (const trilha of trilhas) {
      console.log(
        `🔍 [trilhaService] Processing trilha: ${trilha.id} - ${trilha.name}`
      );

      const idCiclo = getIdCicloFromTrilha(trilha);
      console.log(
        `🔄 [trilhaService] Using idCiclo: ${idCiclo} for trilha ${trilha.id}`
      );

      for (const [tipoKey, criterios] of Object.entries(
        trilha.criteriosGrouped
      )) {
        console.log(
          `📋 [trilhaService] Processing criterios for tipo '${tipoKey}':`,
          criterios
        );

        const createPromise = criarCriteriosBulk(criterios, trilha.id, idCiclo);
        allOperations.push(createPromise);

        const updatePromise = atualizarCriteriosBulk(criterios);
        allOperations.push(updatePromise);
      }
    }

    console.log(
      `⏳ [trilhaService] Executing ${allOperations.length} operations in parallel...`
    );
    await Promise.all(allOperations);

    console.log("✅ [trilhaService] All criterios saved successfully");
  } catch (error) {
    console.error("❌ [trilhaService] Error saving criterios:", error);
    throw error;
  }
}

export async function removerCriterio(criterioId: number) {
  const deleteUrl = `/criterio/${criterioId}`;
  console.log("🗑️ [trilhaService] Removing criterio with ID:", criterioId);
  console.log("🌐 [trilhaService] Making DELETE request to:", deleteUrl);

  const response = await apiFetch(deleteUrl, {
    method: "DELETE",
  });

  console.log("📡 [trilhaService] DELETE Response status:", response.status);
  console.log("📡 [trilhaService] DELETE Response ok:", response.ok);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ [trilhaService] Failed to delete criterio: ${response.status} - ${errorBody}`
    );
    throw new Error(`Erro ao remover critério: ${errorBody}`);
  }

  console.log("✅ [trilhaService] Successfully deleted criterio:", criterioId);
}
