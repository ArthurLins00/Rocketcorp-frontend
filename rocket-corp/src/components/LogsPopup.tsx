import React, { useState, useEffect } from 'react';
import { getRecentLogs } from '../services/logService';
import type { Log } from '../services/logService';

interface LogsPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LogsPopup: React.FC<LogsPopupProps> = ({ isVisible, onClose }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      fetchLogs();
      // Auto-hide after 10 seconds if not expanded
      const timer = setTimeout(() => {
        if (!isExpanded) {
          onClose();
        }
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isExpanded, onClose]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const recentLogs = await getRecentLogs();
      setLogs(recentLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionDescription = (action: string, entity: string) => {
    // Normalizar ação (trim e lowercase para comparação)
    const normalizedAction = action.trim().toLowerCase();
    const normalizedEntity = entity.trim();
    
    // Debug para verificar os valores recebidos
    console.log('Debug - Action:', action, 'Entity:', entity);
    console.log('Debug - Normalized Action:', normalizedAction, 'Normalized Entity:', normalizedEntity);

    // Mapeamento mais descritivo baseado na ação e entidade
    const actionEntityMap: Record<string, Record<string, string>> = {
      CREATE: {
        User: 'cadastrou um novo usuário',
        Equipe: 'criou uma nova equipe',
        Avaliacao: 'realizou uma avaliação',
        Criterio: 'adicionou um novo critério',
        Equalizacao: 'realizou uma equalização',
        Autoavaliacao: 'fez uma autoavaliação',
        Avaliacao360: 'realizou uma avaliação 360°',
        Mentoring: 'criou um registro de mentoring',
        Referencia: 'fez uma referência',
        ResumoIA: 'gerou um resumo de IA',
        Trilha: 'criou uma nova trilha',
        Ciclo: 'criou um novo ciclo',
      },
      UPDATE: {
        User: 'atualizou dados do usuário',
        Equipe: 'modificou informações da equipe',
        Avaliacao: 'revisou uma avaliação',
        Criterio: 'editou um critério',
        Equalizacao: 'ajustou uma equalização',
        Autoavaliacao: 'revisou uma autoavaliação',
        Avaliacao360: 'modificou uma avaliação 360°',
        Mentoring: 'atualizou dados do mentoring',
        Referencia: 'modificou uma referência',
        ResumoIA: 'atualizou um resumo de IA',
        Trilha: 'modificou uma trilha',
        Ciclo: 'atualizou um ciclo',
      },
      PATCH: {
        User: 'modificou perfil do usuário',
        Equipe: 'ajustou configurações da equipe',
        Avaliacao: 'corrigiu uma avaliação',
        Criterio: 'ajustou um critério',
        Equalizacao: 'revisou uma equalização',
        Autoavaliacao: 'corrigiu uma autoavaliação',
        Avaliacao360: 'ajustou uma avaliação 360°',
        Mentoring: 'modificou mentoring',
        Referencia: 'ajustou uma referência',
        ResumoIA: 'modificou resumo de IA',
        Trilha: 'ajustou uma trilha',
        Ciclo: 'modificou um ciclo',
      },
      DELETE: {
        User: 'removeu um usuário',
        Equipe: 'excluiu uma equipe',
        Avaliacao: 'deletou uma avaliação',
        Criterio: 'removeu um critério',
        Equalizacao: 'excluiu uma equalização',
        Autoavaliacao: 'removeu uma autoavaliação',
        Avaliacao360: 'deletou uma avaliação 360°',
        Mentoring: 'excluiu um mentoring',
        Referencia: 'removeu uma referência',
        ResumoIA: 'deletou um resumo de IA',
        Trilha: 'excluiu uma trilha',
        Ciclo: 'removeu um ciclo',
      },
    };

    // Mapeamento específico para ações com variações
    const specificActionMap: Record<string, Record<string, string>> = {
      'update_gestor_bulk': {
        Avaliacao: 'realizou uma avaliação de gestor',
      },
      'create_bulk': {
        Avaliacao: 'submeteu sua avaliação de ciclo',
      },
      // Variações possíveis
      'update gestor bulk': {
        Avaliacao: 'realizou uma avaliação de gestor',
      },
      'create bulk': {
        Avaliacao: 'submeteu sua avaliação de ciclo',
      },
      'UPDATE_GESTOR_BULK': {
        Avaliacao: 'realizou uma avaliação de gestor',
      },
      'CREATE_BULK': {
        Avaliacao: 'submeteu sua avaliação de ciclo',
      },
    };

    // Fallback para ações/entidades não mapeadas
    const actionLabels: Record<string, string> = {
      CREATE: 'criou',
      UPDATE: 'atualizou',
      PATCH: 'modificou',
      DELETE: 'removeu',
      'update_gestor_bulk': 'realizou',
      'create_bulk': 'submeteu',
    };

    const entityLabels: Record<string, string> = {
      User: 'usuário',
      Equipe: 'equipe',
      Avaliacao: 'avaliação',
      Criterio: 'critério',
      Equalizacao: 'equalização',
      Autoavaliacao: 'autoavaliação',
      Avaliacao360: 'avaliação 360°',
      Mentoring: 'mentoring',
      Referencia: 'referência',
      ResumoIA: 'resumo de IA',
      Trilha: 'trilha',
      Ciclo: 'ciclo',
    };

    // Tenta usar o mapeamento específico primeiro (case-insensitive)
    if (specificActionMap[action] && specificActionMap[action][normalizedEntity]) {
      return specificActionMap[action][normalizedEntity];
    }

    // Tenta usar o mapeamento específico com ação normalizada
    if (specificActionMap[normalizedAction] && specificActionMap[normalizedAction][normalizedEntity]) {
      return specificActionMap[normalizedAction][normalizedEntity];
    }

    // Tenta usar o mapeamento genérico
    if (actionEntityMap[action] && actionEntityMap[action][normalizedEntity]) {
      return actionEntityMap[action][normalizedEntity];
    }

    // Fallback para mapeamento genérico
    const actionLabel = actionLabels[action] || actionLabels[normalizedAction] || action.toLowerCase();
    const entityLabel = entityLabels[normalizedEntity] || normalizedEntity.toLowerCase();
    
    return `${actionLabel} ${entityLabel}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-[400px] h-[500px]' : 'w-[300px] h-[200px]'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#08605F] text-white rounded-t-lg">
          <h3 className="font-semibold text-sm">
            Logs das Últimas 24h
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:text-gray-200 text-sm"
            >
              {isExpanded ? '−' : '+'}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 overflow-y-auto ${isExpanded ? 'h-[420px]' : 'h-[120px]'}`}>
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08605F]"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs mb-2">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Nenhum log nas últimas 24h
                </div>
              ) : (
                logs.slice(0, isExpanded ? undefined : 3).map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded p-3 hover:bg-gray-50 text-xs"
                  >
                    <div className="flex items-start gap-1 mb-1">
                      <span className="font-semibold text-[#08605F] truncate">
                        {log.user.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 flex-1">
                        {getActionDescription(log.action, log.entity)}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                ))
              )}
              {!isExpanded && logs.length > 3 && (
                <div className="text-center text-[#08605F] text-xs font-medium cursor-pointer hover:underline">
                  +{logs.length - 3} mais logs
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 