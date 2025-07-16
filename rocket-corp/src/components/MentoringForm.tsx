import { useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import AvatarInicial from "./AvatarInicial";
import { buscarUsuarios } from "../services/userService";
import type { User } from "../services/userService";

type MentoringData = {
  idAvaliador: string;
  idAvaliado: string; // mentor selecionado
  idCiclo: string;
  nota: number;
  justificativa: string;
};

type MentoringFormProps = {
  idAvaliador: string;
  idCiclo: string;
};

const LOCAL_STORAGE_KEY = "mentoring";

const getInitialState = (idAvaliador: string, idCiclo: string): MentoringData => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // ✅ CORREÇÃO: Sempre usar os parâmetros atuais para idAvaliador e idCiclo
      return {
        ...parsed,
        idAvaliador, // ✅ Forçar usar o parâmetro atual
        idCiclo,     // ✅ Forçar usar o parâmetro atual
      };
    }
  }
  return { idAvaliador, idAvaliado: "", idCiclo, nota: 0, justificativa: "" };
};

export default function MentoringForm({ idAvaliador, idCiclo }: MentoringFormProps) {
  const [dados, setDados] = useState<MentoringData>(() =>
    getInitialState(idAvaliador || "", idCiclo || "")
  );
  const [termoBusca, setTermoBusca] = useState("");

  // ✅ Estados para usuários do banco
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
  const [mentorAutomatico, setMentorAutomatico] = useState<User | null>(null);
  
  // ✅ Carregar usuários do banco na montagem do componente
  useEffect(() => {
    const carregarUsuarios = async () => {
      setCarregandoUsuarios(true);
      try {
        const usuariosCarregados = await buscarUsuarios();
        console.log('👥 Usuários carregados no MentoringForm:', usuariosCarregados);
        setUsuarios(usuariosCarregados);

        // ✅ Encontrar o usuário logado
        const userLogado = usuariosCarregados.find(u => u.id.toString() === idAvaliador);
        if (userLogado) {
          setUsuarioLogado(userLogado);
          console.log('👤 Usuário logado:', userLogado);

          // ✅ Se o usuário tem mentor definido, usar o objeto mentor
          if (userLogado.mentor) {
            // ✅ Buscar o mentor completo na lista de usuários
            const mentorCompleto = usuariosCarregados.find(u => u.id === userLogado.mentor!.id);
            if (mentorCompleto) {
              setMentorAutomatico(mentorCompleto);
              console.log('🎯 Mentor automático encontrado:', mentorCompleto);
              
              // ✅ Configurar automaticamente o mentor nos dados
              setDados(prev => ({
                ...prev,
                idAvaliado: mentorCompleto.id.toString(),
              }));
            } else {
              // ✅ Fallback: usar o objeto mentor básico se não encontrar na lista
              console.log('🎯 Usando dados básicos do mentor:', userLogado.mentor);
              setMentorAutomatico(userLogado.mentor as User);
              setDados(prev => ({
                ...prev,
                idAvaliado: userLogado.mentor!.id.toString(),
              }));
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dados));
  }, [dados]);

  // ✅ Buscar mentor selecionado pelos usuários reais
  const mentorSelecionado = usuarios.find((u) => u.id.toString() === dados.idAvaliado) || mentorAutomatico;

  // ✅ Filtrar usuários para busca (excluir o próprio avaliador e o já selecionado)
  const resultadosBusca = usuarios.filter((usuario) => {
    const matchBusca = usuario.name.toLowerCase().includes(termoBusca.toLowerCase()) ||
                      usuario.email.toLowerCase().includes(termoBusca.toLowerCase());
    const naoSelecionado = usuario.id.toString() !== dados.idAvaliado;
    const naoEhOProprio = usuario.id.toString() !== idAvaliador;
    
    return matchBusca && naoSelecionado && naoEhOProprio;
  });

  const removerMentor = () => {
    setDados({
      idAvaliador,
      idAvaliado: "",
      idCiclo,
      nota: 0,
      justificativa: "",
    });
  };

  const selecionarMentorManual = (mentor: User) => {
    setDados((prev) => ({
      ...prev,
      idAvaliado: mentor.id.toString(),
      idAvaliador,
      idCiclo,
    }));
    setTermoBusca("");
  };

  return (
    <div className="space-y-6">
      {/* ✅ Busca manual (apenas se não tiver mentor selecionado) */}
      {!mentorSelecionado && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {usuarioLogado?.mentor
              ? "Ou escolha outro mentor:" 
              : "Buscar seu mentor:"
            }
          </label>
          <input
            type="text"
            placeholder="Buscar mentor"
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
                  onClick={() => selecionarMentorManual(usuario)}
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
              <p className="text-gray-500 text-sm">Nenhum mentor encontrado</p>
            </div>
          )}
        </div>
      )}

      {/* ✅ Formulário de avaliação do mentor */}
      {mentorSelecionado && (
        <div className="relative border rounded-xl p-4 pb-16 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AvatarInicial nome={mentorSelecionado.name} />
              <div>
                <p className="font-semibold">{mentorSelecionado.name}</p>
                <p className="text-sm text-gray-500">{mentorSelecionado.email}</p>
                {mentorSelecionado.trilha && (
                  <p className="text-xs text-blue-600">{mentorSelecionado.trilha.name}</p>
                )}
                {/* ✅ Indicador de mentor automático */}
                {mentorAutomatico && mentorSelecionado.id === mentorAutomatico.id && (
                  <p className="text-xs text-blue-500 font-medium">Mentor</p>
                )}
              </div>
            </div>
            <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded">
              {(dados.nota ?? 0).toFixed(1)}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-small mb-1 text-gray-500">
              Dê uma avaliação de 1 a 5 para seu mentor
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= dados.nota ? "#facc15" : "none"}
                  stroke="#facc15"
                  className="cursor-pointer"
                  onClick={() => setDados((prev) => ({ ...prev, nota: star }))}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-small mb-1 text-gray-500">
              Justifique sua avaliação
            </label>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="Descreva sua experiência com seu mentor"
              value={dados.justificativa}
              onChange={(e) =>
                setDados((prev) => ({ ...prev, justificativa: e.target.value }))
              }
            />
          </div>

          {/* ✅ Botão de remoção apenas para mentores manuais */}
          {!(mentorAutomatico && mentorSelecionado.id === mentorAutomatico.id) && (
            <button
              onClick={removerMentor}
              className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
              aria-label={`Remover mentor ${mentorSelecionado.name}`}
            >
              <Trash size={20} />
            </button>
          )}
        </div>
      )}

      {/* ✅ Mensagem quando usuário não tem mentor definido */}
      {!carregandoUsuarios && !mentorAutomatico && !mentorSelecionado && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Informação:</span> Você não possui um mentor definido oficialmente. 
            Use a busca acima para escolher um mentor e avaliá-lo.
          </p>
        </div>
      )}
    </div>
  );
}

// Função para formatar os dados para envio ao backend
export function getMentoringFormatado(dados: MentoringData): MentoringData {
  return dados;
}
