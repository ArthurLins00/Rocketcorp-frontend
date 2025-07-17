import React from 'react';
import { HistoricoPage } from './gestor/HistoryPage';

export const EvolutionPage: React.FC = () => {
  let currentUserId = '';
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      currentUserId = userObj.id || userObj.userId || '';
    }
  } catch (e) {
    currentUserId = '';
  }

  return (
    <HistoricoPage collaboratorId={currentUserId} />
  );
};
