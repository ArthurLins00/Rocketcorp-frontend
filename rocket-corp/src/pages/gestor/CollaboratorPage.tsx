import React, { useEffect, useState } from 'react';
import { Header } from '../../components/collaborators/collaboratorHeader';
import { SegmentedControl } from '../../components/collaborators/CollaboratorSegmentedControl';
import Avaliacao360Page from './Evaluation360Page';
import HistoricoPage from './HistoryPage';
import type { CriterionBlock } from '../../models/criterions';
import type { Collaborator } from '../../models/collaborator';

import { fetchCriteriaBlocks } from '../../controllers/criteriaControllers';
import { fetchCollaborator, submitManagerEvaluations } from '../../controllers/collaboratorController';
import { EvaluationPage } from './EvaluationPage';

const tabs = ['Avaliação', 'Avaliação 360', 'Histórico'];
export const CollaboratorPage: React.FC = () => {
  const [collaborator, setCollaborator] = useState<Collaborator>();
  const [blocks, setBlocks] = useState<CriterionBlock[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchCollaborator().then(setCollaborator);
    fetchCriteriaBlocks().then(setBlocks);
  }, []);

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

  const handleSave = () => {
    submitManagerEvaluations();
  };

  return (
    <div className="mx-auto">
      <Header
        title={collaborator?.name ?? 'Carregando...'}
        actionLabel={'Concluir e enviar'}
        actionDisabled={!isComplete}
        onAction={handleSave} initials={'LC'} role={'Product Designer'}      />

      <SegmentedControl options={tabs} selectedIndex={activeTab} onChange={setActiveTab} />

      <div className="">
      {activeTab === 0 && (
          <div className="px-8 py-7">
            <EvaluationPage
              blocks={blocks}
              onScoreChange={handleScoreChange}
              onJustificationChange={handleJustificationChange}
            />
          </div>
        )}

        {activeTab === 1 && <Avaliacao360Page />}

        {activeTab === 2 && <HistoricoPage />}
      </div>
    </div>
  );
};