import React from 'react';
import { use360controller } from '../../controllers/360controller';

interface E360PageProps {
  collaboratorId: string;
}

export const Evaluation360Page: React.FC<E360PageProps> = ({ collaboratorId }) => {
  const { evaluations, loading, error, refreshData } = use360controller(collaboratorId);

  if (loading) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando avaliações 360...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={refreshData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="px-8 py-7 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Nenhuma avaliação 360 encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-0 min-h-screen bg-[#f7f7f7] flex flex-col items-center">
      <div className="w-full space-y-8 pt-10 px-0">
        {evaluations.map((eval360: any) => (
          <div key={eval360.id} className="border border-[#CECDCD] rounded-[16px] p-6 bg-white shadow-[0_2px_8px_0_rgba(8,96,95,0.07)] w-full">
            {/* Top row: Avaliador (left), Nota (right) */}
            <div className="flex flex-row justify-between items-center px-2 pt-2 pb-3">
              <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#08605f] text-lg bg-[#e6e6e680] px-3 py-1 rounded-md">Avaliador: {eval360.avaliador?.name ?? '-'}</span>
              <span className="flex items-center gap-2">
                <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#08605f] text-base">Nota:</span>
                <span className="[font-family:'Inter-Bold',Helvetica] font-bold text-[#08605f] text-xl bg-[#e6e6e680] px-2 py-1 rounded-md">{eval360.nota ?? '-'}</span>
              </span>
            </div>
            {/* Second row: Pontos Fortes & Pontos de Melhora */}
            <div className="flex flex-row w-full px-2 pb-3 gap-8">
              <div className="flex flex-col w-1/2">
                <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#08605f] text-xs mb-2">Pontos Fortes</span>
                <div className="bg-[#e6e6e680] rounded-md border-2 border-[#08605f] h-20 flex items-start overflow-y-auto">
                  <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1c] text-xs py-2 px-3 break-words w-full">
                    {eval360.pontosFortes || 'Nenhum ponto forte informado.'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-1/2">
                <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#08605f] text-xs mb-2">Pontos de Melhora</span>
                <div className="bg-[#e6e6e680] rounded-md border-2 border-[#08605f] h-20 flex items-start overflow-y-auto">
                  <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1c] text-xs py-2 px-3 break-words w-full">
                    {eval360.pontosMelhora || 'Nenhum ponto de melhora informado.'}
                  </span>
                </div>
              </div>
            </div>
            {/* Third row: Trabalharia Novamente */}
            <div className="px-2 pb-2 pt-3">
              <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-[#1c1c1cbf] text-xs mb-2 block">Trabalharia Novamente</span>
              <span className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#1c1c1c] text-sm">{eval360.trabalhariaNovamente ?? '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
