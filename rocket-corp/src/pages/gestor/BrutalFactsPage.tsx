import { useEffect, useState } from 'react';
import { CollaboratorScore } from '../../components/history/CollaboratorScore';
import { CollaboratorGrowth } from "../../components/history/CollaboratorGrowth"
import { CollaboratorPerformanceChart } from '../../components/history/CollaboratorPerformanceChart';
import { CollaboratorTotalEvaluations } from '../../components/history/CollaboratorTotalEvaluations';
import EqualizacaoCard from '../../components/equalizacao/EqualizacaoCard';
import GenAIComponent from '../../components/GenAIComponent';
import { getUsuarioLogado } from '../../utils/auth';
import { buscarUsuariosPorGestor, type User } from '../../services/userService';
import { authenticatedFetch } from '../../utils/auth';
import { getEqualizacoes } from '../utils/equalizacaoService';
import type { Equalizacao } from '../../types/Equalizacao';
import type { PerformanceData } from '../../models/history';
import { getUsersStatisticsByCiclo } from '../../services/statisticsService';

interface Ciclo {
  id: number;
  name: string;
  year: number;
  period: number;
  status: string; // Added status to the interface
}

interface UserStatistics {
  user: { id: number; name: string; email: string };
  autoavaliacaoAverage: number | null;
  avaliacaoGestorAvg: number | null;
  avaliacao360Avg: number | null;
}

interface BrutalFactsHistory {
  currentScore: number;
  currentSemester: string;
  lastScore: number;
  lastSemester: string;
  totalEvaluations: number;
  performanceData: PerformanceData[];
}

export default function BrutalFactsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lideradosComEqualizacao, setLideradosComEqualizacao] = useState<{ liderado: User; equalizacao: Equalizacao | null }[]>([]);
  const [history, setHistory] = useState<BrutalFactsHistory | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Usuário logado
        const usuario = getUsuarioLogado() as User | null;
        if (!usuario) {
          setLoading(false);
          return;
        }
        const gestorId = usuario.id;
        // 2. Buscar todos usuários sob o gestor logado
        const liderados = await buscarUsuariosPorGestor(gestorId);
        // 3. Buscar ciclos (pegar 4 mais recentes, apenas status válidos)
        const ciclosRes = await authenticatedFetch('/cicle');
        let ciclos: Ciclo[] = ciclosRes ? await ciclosRes.json() : [];
        // Filtrar apenas ciclos com status permitido
        const statusPermitidos = ['aberto', 'revisaoGestor', 'revisaoComite', 'finalizado'];
        ciclos = Array.isArray(ciclos) ? ciclos.filter(c => statusPermitidos.includes(c.status)) : [];
        const ciclosOrdenados = ciclos.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.period - a.period;
        });
        const ciclosParaGrafico = ciclosOrdenados.slice(0, 4).reverse();
        // 4. Buscar estatísticas dos liderados por ciclo
        const performanceData: PerformanceData[] = [];
        let currentScore = 0;
        let lastScore = 0;
        let currentSemester = '';
        let lastSemester = '';
        let totalEvaluations = 0;
        for (let i = 0; i < ciclosParaGrafico.length; i++) {
          const ciclo = ciclosParaGrafico[i];
          let stats: UserStatistics[] = [];
          try {
            stats = await getUsersStatisticsByCiclo(ciclo.id);
          } catch {
            stats = [];
          }
          const statsLiderados = stats.filter((s) => liderados.some(l => l.id === s.user.id));
          const notas = statsLiderados.map((s) => s.autoavaliacaoAverage ?? s.avaliacaoGestorAvg ?? s.avaliacao360Avg).filter((n): n is number => n != null);
          const media = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
          performanceData.push({ semester: ciclo.name, score: media });
          if (i === ciclosParaGrafico.length - 1) {
            currentScore = media;
            currentSemester = ciclo.name;
            totalEvaluations = statsLiderados.length;
          }
          if (i === ciclosParaGrafico.length - 2) {
            lastScore = media;
            lastSemester = ciclo.name;
          }
        }
        // 5. Buscar equalizações do ciclo atual
        let equalizacoes: Equalizacao[] = [];
        if (ciclosOrdenados.length > 0) {
          const eqs: Equalizacao[] = await getEqualizacoes();
          equalizacoes = eqs.filter((eq: Equalizacao) => liderados.some(l => l.id.toString() === eq.idAvaliado));
        }
        // Novo: montar array de liderados com ou sem equalizacao
        const lideradosComEq = liderados.map(liderado => {
          const eq = equalizacoes.find(eq => eq.idAvaliado === liderado.id.toString()) || null;
          return { liderado, equalizacao: eq };
        });
        setLideradosComEqualizacao(lideradosComEq);
        setHistory({
          currentScore,
          currentSemester,
          lastScore,
          lastSemester,
          totalEvaluations,
          performanceData
        });
      } catch {
        setHistory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtro de busca para equalizações (agora sobre nome do liderado)
  const lideradosFiltrados = lideradosComEqualizacao.filter(({ liderado }) =>
    liderado.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Carregando...</div>;
  }
  if (!history) {
    return <div>Erro ao carregar dados. Tente novamente mais tarde.</div>;
  }

  return (
    <div className="px-8 py-7 min-h-screen">
      {/* Primeira linha - 3 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="h-[109px]">
          <CollaboratorScore 
            score={history.currentScore}
            semester={history.currentSemester}
            title="Nota média geral"
          />
        </div>
        <div className="h-[109px]">
          <CollaboratorGrowth 
            currentScore={history.currentScore}
            lastScore={history.lastScore}
            lastCycle={history.lastSemester}
            title="Desempenho de liderados"
          />
        </div>
        <div className="h-[109px]">
          <CollaboratorTotalEvaluations 
            totalEvaluations={history.totalEvaluations}
            title="Liderados avaliados"
            usePeopleIcon={true}
          />
        </div>
      </div>

      {/* Resumo IA entre cards e gráfico */}
      <GenAIComponent
        titulo="Resumo IA do gestor"
        descricao="Este é um resumo gerado por IA sobre o desempenho geral dos liderados deste gestor."
      />

      {/* Segunda linha - Gráfico de desempenho */}
      <div className="mb-5">
        <div className="h-96">
          <CollaboratorPerformanceChart 
            data={history.performanceData}
          />
        </div>
      </div>

      {/* Resumo IA entre gráfico e equalizações */}
      <GenAIComponent
        titulo="Resumo IA do desempenho"
        descricao="Análise automatizada do desempenho dos liderados ao longo dos ciclos."
      />

      {/* Equalizações finalizadas */}
      <div className="mt-8 bg-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Resumo de equalizações</h2>
          <div className="flex items-center space-x-2 bg-white rounded-xl py-2 px-3 border border-gray-200">
            <div className="w-4 h-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#1c1c1cbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="bg-transparent focus:outline-none text-sm text-gray-600 w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          {lideradosFiltrados.length === 0 ? (
            <div className="text-gray-500">
              {searchTerm ? `Nenhum colaborador encontrado para "${searchTerm}".` : "Nenhum colaborador sob sua gestão encontrado."}
            </div>
          ) : (
            lideradosFiltrados.map(({ liderado, equalizacao }) => (
              equalizacao ? (
                <EqualizacaoCard
                  key={liderado.id}
                  equalizacao={equalizacao}
                  onUpdate={() => {}}
                  readOnly={true}
                />
              ) : (
                <div key={liderado.id} className="border rounded p-4 bg-gray-50 text-gray-500">
                  {liderado.name} ainda não possui equalização neste ciclo.
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  )
}