import { useEffect, useState } from "react";
import { Trash, Send } from "lucide-react";
import AvatarInicial from "./AvatarInicial";
import { buscarUsuarios } from "../services/userService";
import type { User } from "../services/userService";
import { enviarReferencias } from "../services/avaliacaoService"; // ✅ Import da nova função

type Referencia = {
  idAvaliado: string;
  idAvaliador: string;
  justificativa: string;
  idCiclo: string;
};

type ReferenciasFormProps = {
  idAvaliador: string;
  idCiclo: string;
};

type ReferenciasState = {
  [colaboradorId: string]: Referencia;
};

const LOCAL_STORAGE_KEY = "referencias";

const getInitialState = (): ReferenciasState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  }
  return {};
};

export default function ReferenciasForm({ idAvaliador, idCiclo }: ReferenciasFormProps) {
  const [referencias, setReferencias] = useState<ReferenciasState>(getInitialState);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>(Object.keys(getInitialState()));

  // ✅ Estados para usuários do banco
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  
  // ✅ Estados para envio
  const [enviando, setEnviando] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState<string | null>(null);

  // ✅ Carregar usuários do banco na montagem do componente
  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregandoUsuarios(true);
      try {
        const usuariosCarregados = await buscarUsuarios();
        console.log('👥 Usuários carregados no ReferenciasForm:', usuariosCarregados);
        setUsuarios(usuariosCarregados);
      } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
      } finally {
        setCarregandoUsuarios(false);
      }
    };

    carregarUsuarios();
  }, []);

  // Corrige registros incompletos do localStorage
  useEffect(() => {
    const atualizadas: ReferenciasState = {};

    Object.entries(referencias).forEach(([id, ref]) => {
      atualizadas[id] = {
        ...ref,
        idAvaliado: id,
        idAvaliador,
        idCiclo,
      };
    });

    setReferencias(atualizadas);
  }, [idAvaliador, idCiclo]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(referencias));
  }, [referencias]);

  // ✅ Função para testar envio das Referências
  const testarEnvioReferencias = async () => {
    try {
      setEnviando(true);
      setMensagemEnvio(null);

      console.log('🚀 Testando envio das Referências...');
      console.log('Dados a serem enviados:', referencias);

      if (Object.keys(referencias).length === 0) {
        throw new Error('Nenhuma referência para enviar. Adicione pelo menos um colaborador.');
      }

      // Validar se todas as referências estão completas
      for (const [id, referencia] of Object.entries(referencias)) {
        if (!referencia.justificativa.trim()) {
          const colaborador = usuarios.find(u => u.id.toString() === id);
          throw new Error(`Referência de ${colaborador?.name || `ID ${id}`} está incompleta: justificativa é obrigatória`);
        }
      }

      const resultado = await enviarReferencias(referencias);
      
      setMensagemEnvio(`✅ ${resultado.message}`);
      console.log('✅ Envio bem-sucedido:', resultado);

      // Limpar localStorage após envio bem-sucedido
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setReferencias({});
      setSelecionados([]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setMensagemEnvio(`❌ Erro: ${errorMessage}`);
      console.error('❌ Erro no envio:', error);
    } finally {
      setEnviando(false);
    }
  };

  const handleSelectColaborador = (id: string) => {
    if (!selecionados.includes(id)) {
      setSelecionados((prev) => [...prev, id]);
    }
  };

  const handleJustificativa = (id: string, texto: string) => {
    setReferencias((prev) => ({
      ...prev,
      [id]: {
        idAvaliado: id,
        idAvaliador,
        idCiclo,
        justificativa: texto,
      },
    }));
  };

  const removerColaborador = (id: string) => {
    setSelecionados((prev) => prev.filter((cid) => cid !== id));

    setReferencias((prev) => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
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
      {/* ✅ Botão de teste no topo */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-green-900">Teste de Envio - Referências</h3>
            <p className="text-sm text-green-700">
              {Object.keys(referencias).length} referência(s) pronta(s) para envio
            </p>
          </div>
          <button
            onClick={testarEnvioReferencias}
            disabled={enviando || Object.keys(referencias).length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium ${
              enviando || Object.keys(referencias).length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Send size={16} />
            {enviando ? 'Enviando...' : 'Testar Envio'}
          </button>
        </div>
        
        {/* ✅ Mensagem de resultado */}
        {mensagemEnvio && (
          <div className={`mt-3 p-2 rounded text-sm ${
            mensagemEnvio.startsWith('✅') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {mensagemEnvio}
          </div>
        )}
      </div>

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

      {selecionados.map((id) => {
        // ✅ Buscar usuário real pelo ID
        const colaborador = usuarios.find((u) => u.id.toString() === id);
        if (!colaborador) return null;

        const dados = referencias[id] || {
          idAvaliado: id,
          idAvaliador,
          idCiclo,
          justificativa: "",
        };

        return (
          <div key={id} className="border rounded-xl p-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AvatarInicial nome={colaborador.name} />
                <div>
                  <p className="font-semibold">{colaborador.name}</p>
                  <p className="text-sm text-gray-500">{colaborador.email}</p>
                  {colaborador.trilha && (
                    <p className="text-xs text-blue-600">{colaborador.trilha.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removerColaborador(id)}
                className="text-red-500 hover:text-red-700"
                aria-label={`Remover ${colaborador.name}`}
              >
                <Trash size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Justifique sua escolha
              </label>
              <textarea
                className="w-full p-2 border rounded resize-none"
                placeholder="Por que essa pessoa é uma referência?"
                value={dados.justificativa}
                onChange={(e) => handleJustificativa(id, e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Para envio ao backend
export function getReferenciasFormatadas(referencias: ReferenciasState): Referencia[] {
  return Object.values(referencias);
}
