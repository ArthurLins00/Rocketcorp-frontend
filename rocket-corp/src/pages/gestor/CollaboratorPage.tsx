import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../../components/collaborators/CollaboratorHeader';
import { SegmentedControl } from '../../components/collaborators/CollaboratorSegmentedControl';
import Avaliacao360Page from './Evaluation360Page';
import { HistoricoPage } from './HistoryPage';
import type { CriterionBlock } from '../../models/criterions';
import type { Collaborator } from '../../models/collaborator';
import { fetchCriteriaBlocks } from '../../controllers/criteriaControllers';
import { fetchCollaborator, submitManagerEvaluations } from '../../controllers/collaboratorController';
import { EvaluationPage } from './EvaluationPage';
import { buscarCicloAberto } from '../../services/cicleService';

const tabs = ['Avaliação', 'Avaliação 360', 'Histórico'];
export const CollaboratorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [collaborator, setCollaborator] = useState<Collaborator>();
  const [blocks, setBlocks] = useState<CriterionBlock[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ciclo, setCiclo] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setError('ID do colaborador não encontrado');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // Get cicloAberto first
        const cicloAberto = await buscarCicloAberto();
        if (!cicloAberto || !cicloAberto.id) {
          setError('Nenhum ciclo aberto encontrado.');
          setLoading(false);
          return;
        }
        // Then fetch collaborator and blocks using cicloAberto.id
        const [collaboratorData, blocksData] = await Promise.all([
          fetchCollaborator(id),
          fetchCriteriaBlocks(id, cicloAberto.id.toString()),
        ]);
        setCollaborator(collaboratorData);
        setBlocks(blocksData);
        setCiclo(cicloAberto);
      } catch (err) {
        setError('Erro ao carregar dados do colaborador');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleScoreChange = (id: string, score: number) => {
    setBlocks(prev =>
      prev.map(b => ({
        ...b,
        criteria: b.criteria.map(c =>
          c.id === id ? { ...c, managerScore: score } : c
        )
      }))
    );
  };

  const handleJustificationChange = (id: string, text: string) => {
    setBlocks(prev =>
      prev.map(b => ({
        ...b,
        criteria: b.criteria.map(c =>
          c.id === id ? { ...c, managerJustification: text } : c
        )
      }))
    );
  };

  // só habilita quando cada critério tiver nota > 0
  const isComplete = blocks.every(b =>
    b.criteria.every(c => (c.managerScore ?? 0) > 0)
  );

  const handleSave = async () => {
    if (id && ciclo) {
      try {
        await submitManagerEvaluations(id, ciclo.id.toString(), blocks);
        // Optionally show success feedback here
        alert('Avaliações do gestor salvas com sucesso!');
      } catch (err: any) {
        alert('Erro ao salvar avaliações do gestor: ' + (err?.message || err));
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto p-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Header
        title={collaborator?.name ?? 'Colaborador'}
        actionLabel={'Concluir e enviar'}
        actionDisabled={!isComplete}
        onAction={handleSave} 
        initials={collaborator?.name?.split(' ').map(n => n[0]).join('') ?? 'LC'} 
        role={collaborator?.cargo ?? 'Product Designer'}      
      />

      <SegmentedControl options={tabs} selectedIndex={activeTab} onChange={setActiveTab} />

      <div className="">
        {activeTab === 0 && (
          <div className="px-6 py-6">
            <EvaluationPage
              blocks={blocks}
              onScoreChange={handleScoreChange}
              onJustificationChange={handleJustificationChange}
              ciclo={ciclo}
              collaborator={collaborator}
            />
          </div>
        )}

        {activeTab === 1 && <Avaliacao360Page ciclo={ciclo} collaborator={collaborator} />}

        {activeTab === 2 && <HistoricoPage collaboratorId={collaborator?.id} ciclo={ciclo} />}
      </div>
    </div>
  );
};