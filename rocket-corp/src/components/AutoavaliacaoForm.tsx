import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { buscarUsuarios } from "../services/userService";

export type AutoavaliacaoItem = {
  idAvaliador: string;
  idAvaliado: string;
  idCiclo: string;
  criterioId: number; // Alterado para number para compatibilidade com o backend
  nota: number;
  justificativa: string;
};

type AutoavaliacaoState = {
  [criterioId: string]: AutoavaliacaoItem;
};

// Novo tipo para representar os critérios vindos do backend
type Criterio = {
  id: number;
  name: string;
  tipo: string;
  peso: number;
  description: string;
  enabled: boolean;
};

// Agrupamento por tipo de critério
type CriteriosAgrupados = {
  comportamental: Criterio[];
  tecnico: Criterio[];
  gestao: Criterio[];
  negocios: Criterio[];
  [key: string]: Criterio[];
};

const LOCAL_STORAGE_KEY = "autoavaliacao";

// Função para buscar os critérios da trilha do usuário E ciclo
async function buscarCriteriosDaTrilha(userId: string, cicloId: string): Promise<CriteriosAgrupados> {
  try {
    // Buscar o usuário para obter a trilhaId
    const usuarios = await buscarUsuarios();
    const usuario = usuarios.find(u => u.id === Number(userId));
    if (!usuario || !usuario.trilhaId) {
      console.warn('⚠️ Usuário não tem trilha associada:', usuario);
      throw new Error("Usuário não encontrado ou não possui trilha associada");
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    // Buscar critérios da trilha do usuário para o ciclo aberto
    const response = await fetch(`${API_BASE_URL}/criterio/trilha/${usuario.trilhaId}/ciclo/${cicloId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar critérios: ${response.statusText}`);
    }
    const criterios: Criterio[] = await response.json();
    console.log(`📋 Critérios recebidos (${criterios.length}):`, criterios);
    // Filtrar apenas critérios habilitados
    const criteriosHabilitados = criterios.filter(c => c.enabled);
    console.log(`✅ Critérios habilitados (${criteriosHabilitados.length}/${criterios.length})`);
    // Agrupar por tipo
    const criteriosAgrupados: CriteriosAgrupados = {
      comportamental: [],
      tecnico: [],
      gestao: [],
      negocios: []
    };
    criteriosHabilitados.forEach(criterio => {
      if (!criteriosAgrupados[criterio.tipo]) {
        criteriosAgrupados[criterio.tipo] = [];
      }
      criteriosAgrupados[criterio.tipo].push(criterio);
    });
    // Mostrar contagem por tipo
    console.log('📊 Critérios por tipo:');
    Object.entries(criteriosAgrupados).forEach(([tipo, criterios]) => {
      console.log(`   - ${tipo}: ${criterios.length}`);
    });
    return criteriosAgrupados;
  } catch (error) {
    console.error('❌ Erro ao buscar critérios da trilha:', error);
    return { comportamental: [], tecnico: [], gestao: [], negocios: [] };
  }
}

const getInitialResponses = (): AutoavaliacaoState => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
  }

  return {};
};

export default function AutoavaliacaoForm({
  idAvaliador,
  idCiclo,
}: {
  idAvaliador: string;
  idCiclo: string;
}) {
  const [responses, setResponses] = useState<AutoavaliacaoState>(() =>
    getInitialResponses()
  );
  const [criteriosAgrupados, setCriteriosAgrupados] = useState<CriteriosAgrupados>({
    comportamental: [],
    tecnico: [],
    gestao: [],
    negocios: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar critérios ao carregar o componente
  useEffect(() => {
    if (!idAvaliador || !idCiclo) return;
    const fetchCriterios = async () => {
      try {
        console.log('🔄 Iniciando carregamento de critérios para usuário:', idAvaliador, 'e ciclo:', idCiclo);
        setIsLoading(true);
        setError(null);
        const criterios = await buscarCriteriosDaTrilha(idAvaliador, idCiclo);
        setCriteriosAgrupados(criterios);
        // Contar critérios totais
        const totalCriterios = Object.values(criterios).reduce(
          (sum, grupo) => sum + grupo.length, 0
        );
        console.log(`✅ Carregamento completo: ${totalCriterios} critérios no total`);
        // Inicializar respostas para os critérios carregados se não existirem no localStorage
        const savedResponses = { ...responses };
        let novosRegistros = 0;
        let atualizados = 0;
        // Para cada critério, garantir que existe uma entrada em savedResponses
        Object.values(criterios).forEach(grupo => {
          grupo.forEach(criterio => {
            const criterioId = criterio.id.toString();
            if (!savedResponses[criterioId]) {
              savedResponses[criterioId] = {
                idAvaliador,
                idAvaliado: idAvaliador,
                idCiclo,
                criterioId: criterio.id,
                nota: 0,
                justificativa: "",
              };
              novosRegistros++;
            } else {
              // Garantir que os campos obrigatórios estejam corretos
              savedResponses[criterioId] = {
                ...savedResponses[criterioId],
                idAvaliador,
                idAvaliado: idAvaliador,
                idCiclo,
                criterioId: criterio.id
              };
              atualizados++;
            }
          });
        });
        console.log(`📝 Respostas inicializadas: ${novosRegistros} novas, ${atualizados} atualizadas`);
        setResponses(savedResponses);
      } catch (error) {
        console.error('❌ Erro ao buscar critérios:', error);
        setError('Não foi possível carregar os critérios. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCriterios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idAvaliador, idCiclo]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const updateField = (
    criterioId: string,
    field: "nota" | "justificativa",
    value: number | string
  ) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [criterioId]: {
          ...prev[criterioId],
          [field]: value,
          // Garantir que os IDs não se percam ao atualizar
          idAvaliador,
          idAvaliado: idAvaliador,
          idCiclo,
          criterioId: Number(criterioId) // Converter para número
        },
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Função para traduzir os tipos de critério para títulos mais amigáveis
  const getTitleForTipo = (tipo: string): string => {
    const titles: Record<string, string> = {
      comportamental: "Critérios Comportamentais",
      tecnico: "Critérios Técnicos",
      gestao: "Critérios de Gestão",
      negocios: "Critérios de Negócios"
    };
    
    return titles[tipo] || `Critérios de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
  };

  const renderSection = (tipo: string, criterios: Criterio[]) => {
    if (criterios.length === 0) return null;

    const filledCount = criterios.filter(
      (c) => {
        const response = responses[c.id.toString()];
        return (
          response?.nota > 0 &&
          response?.justificativa && 
          response.justificativa.trim().length > 0
        );
      }
    ).length;
  
    const total = criterios.length;
  
    const average =
      filledCount > 0
        ? (
            criterios.reduce((acc, c) => {
              const item = responses[c.id.toString()];
              if (
                item &&
                item.nota > 0 &&
                item.justificativa && 
                item.justificativa.trim().length > 0
              ) {
                return acc + item.nota;
              }
              return acc;
            }, 0) / filledCount
          ).toFixed(1)
        : "0.0";

    const getProgressClasses = () => {
      if (filledCount === 0) return "text-red-700 bg-red-100";
      if (filledCount === total) return "text-green-700 bg-green-100";
      return "text-yellow-700 bg-yellow-100";
    };

    return (
      <div key={tipo} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{getTitleForTipo(tipo)}</h2>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
              {average}
            </span>
            <span
              className={`text-sm px-2 py-1 font-bold rounded ${getProgressClasses()}`}
            >
              {filledCount}/{total} preenchidos
            </span>
          </div>
        </div>

        {criterios.map((criterio) => {
          const criterioId = criterio.id.toString();
          const item = responses[criterioId];
          const nota = item?.nota ?? 0;
          const justificativa = item?.justificativa ?? "";

          return (
            <div
              key={criterioId}
              className="border rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{criterio.name}</p>
                  <p className="text-sm text-gray-500">{criterio.description}</p>
                </div>
                <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                  {nota.toFixed(1)}
                </span>
              </div>
              <label className="block font-small mb-1 text-sm text-gray-500">
                Dê uma avaliação de 1 a 5 com base no critério
              </label>
              <div className="flex gap-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= nota ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => updateField(criterioId, "nota", star)}
                  />
                ))}
              </div>

              <textarea
                className="w-full p-2 border rounded-lg resize-none"
                placeholder="Justifique sua nota"
                value={justificativa}
                onChange={(e) =>
                  updateField(criterioId, "justificativa", e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-12 bg-white border rounded-xl flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p>Carregando critérios da sua trilha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border rounded-xl">
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Verificar se existem critérios
  const hasCriterios = Object.values(criteriosAgrupados).some(grupo => grupo.length > 0);

  if (!hasCriterios) {
    return (
      <div className="p-6 bg-white border rounded-xl">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700 font-medium">Nenhum critério encontrado</p>
          <p className="text-yellow-600">Não encontramos critérios disponíveis para sua trilha. Entre em contato com seu gestor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12 bg-white relative border rounded-xl">
      {/* Renderizar cada seção de critérios */}
      {Object.entries(criteriosAgrupados).map(([tipo, criterios]) =>
        renderSection(tipo, criterios)
      )}
    </div>
  );
}

export function getAutoavaliacoesFormatadas(
  state: AutoavaliacaoState
): AutoavaliacaoItem[] {
  const filtered = Object.values(state).filter(
    (item) => item.nota > 0 && item.justificativa.trim().length > 0
  );
  
  console.log('📊 Autoavaliações formatadas:', filtered.length);
  console.log('📊 IDs dos critérios:', filtered.map(item => item.criterioId));
  
  return filtered;
}