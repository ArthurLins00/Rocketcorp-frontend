import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";
import { buscarUsuarios, getMembrosAndGestorByEquipe } from "../services/userService";
import type { User } from "../services/userService";

type AvaliacaoColaborador = {
  idAvaliador: string;
  idAvaliado: string;
  nota: number;
  pontosFortes: string;
  pontosMelhoria: string;
  nomeProjeto: string;
  periodoMeses: string;
  trabalhariaNovamente: number;
  idCiclo: string;
};

type Avaliacao360FormProps = {
  idAvaliador: string;
  idCiclo: string;
};

type Avaliacao360State = {
  [colaboradorId: string]: AvaliacaoColaborador;
};

const LOCAL_STORAGE_KEY = "avaliacao360";

const getInitialState = (): Avaliacao360State => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return {};
};

export default function Avaliacao360Form({ idAvaliador, idCiclo }: Avaliacao360FormProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao360State>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(Object.keys(getInitialState()));
  
  // ✅ Estados para usuários do banco
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  
  // ✅ Estados para equipe
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
  const [equipeAutomatica, setEquipeAutomatica] = useState<User[]>([]);
  
  // ✅ Carregar usuários do banco na montagem do componente
  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregandoUsuarios(true);
      try {
        const usuariosCarregados = await buscarUsuarios();
        console.log('👥 Usuários carregados no Avaliacao360Form:', usuariosCarregados);
        setUsuarios(usuariosCarregados);

        // ✅ Encontrar o usuário logado
        const userLogado = usuariosCarregados.find(u => u.id.toString() === idAvaliador);
        if (userLogado) {
          setUsuarioLogado(userLogado);
          console.log('👤 Usuário logado:', userLogado);

          // ✅ Se o usuário tem equipe definida, carregar membros da equipe + gestor
          if (userLogado.idEquipe) {
            console.log('🏢 Usuário pertence à equipe:', userLogado.idEquipe);
            try {
              const membrosEquipe = await getMembrosAndGestorByEquipe(userLogado.idEquipe);
              console.log('👥 Membros da equipe (incluindo gestor) carregados:', membrosEquipe);
              // ✅ Filtrar apenas membros que não são o próprio usuário
              const membrosSemUsuario = membrosEquipe.filter(membro => membro.id.toString() !== idAvaliador);
              setEquipeAutomatica(membrosSemUsuario);
              console.log('✅ Equipe automática configurada:', membrosSemUsuario);

              // ✅ Adicionar automaticamente os membros da equipe sem duplicidade
              const novosIds = membrosSemUsuario.map(m => m.id.toString());
              setSelecionados(prev => Array.from(new Set([...prev, ...novosIds])));
              setAvaliacoes(prev => {
                const novo = { ...prev };
                novosIds.forEach(id => {
                  if (!novo[id]) {
                    novo[id] = {
                      idAvaliador,
                      idAvaliado: id,
                      idCiclo,
                      nota: 0,
                      pontosFortes: "",
                      pontosMelhoria: "",
                      nomeProjeto: "",
                      periodoMeses: "",
                      trabalhariaNovamente: 0,
                    };
                  }
                });
                return novo;
              });
            } catch (error) {
              console.error('❌ Erro ao carregar membros da equipe:', error);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
      } finally {
        setCarregandoUsuarios(false);
      }
    };

    carregarUsuarios();
  }, [idAvaliador]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  const validatePeriodo = (value: string): string => {
    if (value === '') return '';
    
    const num = parseInt(value);
    if (isNaN(num)) return '';
    
    if (num < 1) return '1';
    if (num > 12) return '12';
    return value;
  };

  const handleSelectColaborador = (id: string) => {
    if (!selecionados.includes(id)) {
      setSelecionados((prev) => [...prev, id]);

      setAvaliacoes((prev) => {
        if (!prev[id]) {
          return {
            ...prev,
            [id]: {
              idAvaliador,
              idAvaliado: id,
              idCiclo,
              nota: 0,
              pontosFortes: "",
              pontosMelhoria: "",
              nomeProjeto: "",
              periodoMeses: "",
              trabalhariaNovamente: 0,
            },
          };
        }
        return prev;
      });
    }
  };

  const handleChange = (
    id: string,
    campo: keyof AvaliacaoColaborador,
    valor: string | number
  ) => {
    if (campo === 'periodoMeses' && typeof valor === 'string') {
      valor = validatePeriodo(valor);
    }
  
    setAvaliacoes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  const removerColaborador = (id: string) => {
    setSelecionados((prev) => prev.filter((selId) => selId !== id));
    setAvaliacoes((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // ✅ Filtrar usuários baseado na busca e excluir já selecionados e o próprio avaliador
  const resultadosBusca = usuarios.filter((usuario) => {
    const matchBusca = usuario.name.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(termoBusca.toLowerCase());
    const naoSelecionado = !selecionados.includes(usuario.id.toString());
    const naoEhOProprio = usuario.id.toString() !== idAvaliador;
    
    return matchBusca && naoSelecionado && naoEhOProprio;
  });

  return (
    <div className="space-y-6">

      <div>
        <input
          type="text"
          placeholder="Buscar colaborador"
          className="w-full border p-2 rounded"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          disabled={carregandoUsuarios}
        />
        
        {/* ✅ Loading state */}
        {carregandoUsuarios && (
          <div className="border rounded mt-1 bg-white shadow p-2">
            <p className="text-gray-500 text-sm">Carregando usuários...</p>
          </div>
        )}
        
        {/* ✅ Resultados da busca com usuários reais */}
        {termoBusca && !carregandoUsuarios && resultadosBusca.length > 0 && (
          <ul className="border rounded mt-1 bg-white shadow max-h-60 overflow-y-auto">
            {resultadosBusca.map((usuario) => (
              <li
                key={usuario.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  handleSelectColaborador(usuario.id.toString());
                  setTermoBusca("");
                }}
              >
                <div className="flex items-center gap-2">
                  <AvatarInicial nome={usuario.name} />
                  <div>
                    <p className="font-medium">{usuario.name}</p>
                    <p className="text-sm text-gray-500">{usuario.email}</p>
                    {usuario.trilha && (
                      <p className="text-xs text-blue-600">{usuario.trilha.name}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* ✅ Mensagem quando não há resultados */}
        {termoBusca && !carregandoUsuarios && resultadosBusca.length === 0 && (
          <div className="border rounded mt-1 bg-white shadow p-2">
            <p className="text-gray-500 text-sm">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* ✅ Mensagem quando usuário não tem equipe definida */}
      {!carregandoUsuarios && !equipeAutomatica.length && usuarioLogado && !usuarioLogado.idEquipe && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Informação:</span> Você não possui uma equipe definida oficialmente. 
            Use a busca acima para escolher colaboradores e avaliá-los.
          </p>
        </div>
      )}

      {selecionados.map((id) => {
        // ✅ Buscar usuário real pelo ID
        const colaborador = usuarios.find((u) => u.id.toString() === id);
        if (!colaborador) return null;
        
        const dados = avaliacoes[id] || {
          idAvaliador,
          idAvaliado: id,
          idCiclo,
          nota: 0,
          pontosFortes: "",
          pontosMelhoria: "",
          nomeProjeto: "",
          periodoMeses: "",
          trabalhariaNovamente: 0,
        };

        return (
          <div
            key={id}
            className="relative border rounded-xl p-4 pb-16 space-y-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AvatarInicial nome={colaborador.name} />
                <div>
                  <p className="font-semibold">{colaborador.name}</p>
                  <p className="text-sm text-gray-500">{colaborador.email}</p>
                  {colaborador.trilha && (
                    <p className="text-xs text-blue-600">{colaborador.trilha.name}</p>
                  )}
                  {/* ✅ Indicador de membro da equipe automática */}
                  {equipeAutomatica.some(membro => membro.id === colaborador.id) && (
                    <p className="text-xs text-green-500 font-medium">Membro da equipe</p>
                  )}
                  {/* ✅ Indicador de gestor */}
                  {equipeAutomatica.find(m => m.id === colaborador.id && m.role?.includes('manager')) && (
                    <p className="text-xs text-blue-500 font-medium">Gestor</p>
                  )}
                </div>
              </div>
              <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
                {(dados.nota || 0).toFixed(1)} 
              </span>
            </div>

            <div>
              <label className="block text-sm font-small mb-1 text-gray-500">
                Dê uma avaliação de 1 a 5 ao colaborador
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= dados.nota ? "#facc15" : "none"}
                    stroke="#facc15"
                    className="cursor-pointer"
                    onClick={() => handleChange(id, "nota", star)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-small text-gray-500">Pontos fortes</label>
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  placeholder="Destaque os pontos positivos do colaborador"
                  value={dados.pontosFortes}
                  onChange={(e) => handleChange(id, "pontosFortes", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-small text-gray-500">Pontos de melhoria</label>
                <textarea
                  className="w-full p-2 border rounded resize-none"
                  placeholder="Destaque os pontos onde o colaborador pode melhorar"
                  value={dados.pontosMelhoria}
                  onChange={(e) => handleChange(id, "pontosMelhoria", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <label className="text-sm font-small text-gray-500">Nome do Projeto</label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Projeto trabalhado juntos"
                  value={dados.nomeProjeto}
                  onChange={(e) => handleChange(id, "nomeProjeto", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-small text-gray-500">Período</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="w-full border p-2 rounded"
                  placeholder="Meses trabalhados (1-12)"
                  value={dados.periodoMeses}
                  onChange={(e) => handleChange(id, "periodoMeses", e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      handleChange(id, "periodoMeses", "1");
                    }
                  }}
                />
                {dados.periodoMeses && (parseInt(dados.periodoMeses) < 1 || parseInt(dados.periodoMeses) > 12) && (
                  <p className="text-red-500 text-xs mt-1">Digite um valor entre 1 e 12</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Você ficaria motivado em trabalhar novamente com essa pessoa?
              </label>
              <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const label = [
                    "Discordo totalmente",
                    "Discordo parcialmente",
                    "Indiferente",
                    "Concordo parcialmente",
                    "Concordo totalmente",
                  ][nivel - 1];
                  return (
                    <label key={nivel} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`trabalharia-${id}`}
                        value={nivel}
                        checked={dados.trabalhariaNovamente === nivel}
                        onChange={() =>
                          handleChange(id, "trabalhariaNovamente", nivel)
                        }
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            </div>

            <button
              onClick={() => removerColaborador(id)}
              className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
              aria-label={`Remover avaliação de ${colaborador.name}`}
            >
              <Trash size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function getAvaliacoesFormatadas(state: Avaliacao360State): AvaliacaoColaborador[] {
  return Object.values(state);
}