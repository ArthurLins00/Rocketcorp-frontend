import React from 'react';
import { HistoricoPage } from './gestor/HistoryPage';

export const EvolutionPage: React.FC = () => {
 
  // TODO: integrar com o backend para obter o ID do colaborador atual
  const currentUserId = '1';
  
  return (
    <HistoricoPage collaboratorId={currentUserId} />
  );
};
