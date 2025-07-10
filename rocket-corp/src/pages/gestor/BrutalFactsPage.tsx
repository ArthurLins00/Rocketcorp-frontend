import { useEffect, useState } from 'react';
import { CollaboratorScore } from '../../components/history/CollaboratorScore';
import { CollaboratorGrowth } from "../../components/history/CollaboratorGrowth"
import { CollaboratorPerformanceChart } from '../../components/history/CollaboratorPerformanceChart';
import { CollaboratorTotalEvaluations } from '../../components/history/CollaboratorTotalEvaluations';
import { getCollaboratorHistoryMock } from '../../mocks/historyMock';
import EqualizacaoCard from '../../components/equalizacao/EqualizacaoCard';
import { mockEqualizacoes } from '../../mocks/mockEqualizacoes';
import GenAIComponent from '../../components/GenAIComponent';

export default function BrutalFactsPage() {
  // Estado para os dados do colaborador
  const [history, setHistory] = useState<any | null>(null);
  // Estado para loading (opcional)
  const [loading, setLoading] = useState(true);
  // Estado para filtro de equalizações
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEqualizacoes, setFilteredEqualizacoes] = useState(mockEqualizacoes.filter(eq => eq.status === 'Finalizado'));

  useEffect(() => {
    // Simula busca dos dados do colaborador (mock)
    async function fetchData() {
      setLoading(true);
      const response = await getCollaboratorHistoryMock('collab-123');
      setHistory(response.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filtra equalizações baseado no termo de busca
  useEffect(() => {
    const filtered = mockEqualizacoes.filter(eq => 
      eq.status === 'Finalizado' && 
      eq.nomeAvaliado.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEqualizacoes(filtered);
  }, [searchTerm]);

  if (loading || !history) {
    return <div>Carregando...</div>;
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
          {filteredEqualizacoes.length === 0 ? (
            <div className="text-gray-500">
              {searchTerm ? `Nenhuma equalização encontrada para "${searchTerm}".` : "Nenhuma equalização finalizada encontrada."}
            </div>
          ) : (
            filteredEqualizacoes.map(eq => (
              <EqualizacaoCard 
                key={eq.idEqualizacao} 
                equalizacao={eq} 
                onUpdate={() => {}} // Não faz nada, só visual
                readOnly={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}