import { User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Mapeamento de critérios baseado na seed (IDs reais do banco)
const CRITERIO_MAP: { [key: string]: number } = {
  'sentimentoDeDono': 1,
  'resiliencia': 2,
  'organizacao': 3,
  'aprendizado': 4,
  'teamPlayer': 5,
  'qualidade': 6,
  'prazos': 7,
  'eficiencia': 8,
  'criatividade': 9,
  'gente': 10,
  'resultados': 11,
  'evolucao': 12
};

// Mapeamento de motivação para enum
const MOTIVACAO_MAP: { [key: number]: string } = {
  1: 'DISCORDO_TOTALMENTE',
  2: 'DISCORDO_PARCIALMENTE', 
  3: 'INDIFERENTE',
  4: 'CONCORDO_PARCIALMENTE',
  5: 'CONCORDO_TOTALMENTE'
};

function convertCicloToNumber(ciclo: string): number {
  if (!ciclo) {
    console.warn('idCiclo undefined, usando padrão 1');
    return 1;
  }
  
  // Mapear "2025.2" para ID correto do banco
  const cicloMap: { [key: string]: number } = {
    '2025.1': 1, // Q1 2025
    '2025.2': 2, // Q2 2025
    '2024.4': 3  // Q4 2024
  };
  
  console.log('Convertendo ciclo:', ciclo, 'para ID:', cicloMap[ciclo] || 1);
  return cicloMap[ciclo] || 1;
}

function getCriterioId(criterioString: string): number {
  console.log('🔍 Mapeando criterioId:', criterioString);
  const id = CRITERIO_MAP[criterioString];
  console.log('🔍 ID encontrado:', id);
  return id || 1;
}

// ✅ Nova função específica para enviar apenas Avaliação 360
export async function enviarAvaliacao360(avaliacao360Data: any) {
  try {
    console.log('=== ENVIANDO AVALIAÇÃO 360 ===');
    console.log('Dados recebidos:', avaliacao360Data);

    if (!avaliacao360Data || Object.keys(avaliacao360Data).length === 0) {
      throw new Error('Nenhuma avaliação 360 para enviar');
    }

    // Converter dados para formato do backend
    const avaliacoes360 = Object.values(avaliacao360Data).map((item: any, index: number) => {
      console.log(`Processando avaliação 360 ${index}:`, item);
      
      const converted = {
        idAvaliador: Number(item.idAvaliador),
        idAvaliado: Number(item.idAvaliado),
        idCiclo: convertCicloToNumber(item.idCiclo),
        nota: Number(item.nota),
        pontosFortes: item.pontosFortes,
        pontosMelhora: item.pontosMelhoria, // Note: pontosMelhoria -> pontosMelhora
        nomeProjeto: item.nomeProjeto,
        periodoMeses: Number(item.periodoMeses) || 1,
        trabalhariaNovamente: MOTIVACAO_MAP[Number(item.trabalhariaNovamente)] || 'INDIFERENTE'
      };
      
      console.log(`Avaliação 360 ${index} convertida:`, converted);
      return converted;
    });

    // Preparar payload para o endpoint /bulk
    const bulkPayload = {
      avaliacoes360: avaliacoes360
    };

    console.log('Payload para /avaliacao/bulk:', JSON.stringify(bulkPayload, null, 2));

    // Enviar para o endpoint bulk
    const response = await fetch(`${API_BASE_URL}/avaliacao/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na requisição:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erro ao enviar avaliações 360: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Avaliações 360 enviadas com sucesso:', result);
    
    return {
      success: true,
      data: result,
      message: `${avaliacoes360.length} avaliação(ões) 360 enviada(s) com sucesso!`
    };

  } catch (error) {
    console.error('❌ Erro no envio da avaliação 360:', error);
    throw error;
  }
}

export async function enviarAvaliacao(dados: any) {
  try {
    console.log('=== DADOS RECEBIDOS PARA ENVIO ===');
    console.log('Autoavaliação:', dados.autoavaliacao);
    console.log('Avaliação 360:', dados.avaliacao360);
    console.log('Referências:', dados.referencias);
    
    if (dados.autoavaliacao && dados.autoavaliacao.length > 0) {
      console.log('Primeira autoavaliação:', dados.autoavaliacao[0]);
      console.log('CriterioId original:', dados.autoavaliacao[0]?.criterioId);
    }
    
    const promises = [];

    // 1. Enviar autoavaliações
    if (dados.autoavaliacao && dados.autoavaliacao.length > 0) {
      console.log('=== PROCESSANDO AUTOAVALIAÇÕES ===');
      const avaliacoesBulk = {
        avaliacoes: dados.autoavaliacao.map((item: any, index: number) => {
          console.log(`Item ${index} original:`, item);
          
          const converted = {
            idAvaliador: item.idAvaliador, // Usar ID válido do banco
            idAvaliado: item.idAvaliador,  // Para autoavaliação, mesmo ID
            idCiclo: convertCicloToNumber(item.idCiclo),
            criterioId: getCriterioId(item.criterioId),
            nota: Number(item.nota),
            justificativa: item.justificativa
          };
          
          console.log(`Autoavaliação ${index} convertida:`, converted);
          return converted;
        })
      };

      console.log('Payload completo para /avaliacao/bulk:', JSON.stringify(avaliacoesBulk, null, 2));
      
      promises.push(
        fetch(`${API_BASE_URL}/avaliacao/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avaliacoesBulk),
        })
      );
    }

    // 2. ✅ Enviar avaliações 360 usando o endpoint /bulk
    if (dados.avaliacao360 && Object.keys(dados.avaliacao360).length > 0) {
      console.log('=== PROCESSANDO AVALIAÇÕES 360 ===');
      const avaliacoes360 = Object.values(dados.avaliacao360).map((item: any, index: number) => {
        const converted = {
          idAvaliador: Number(item.idAvaliador),
          idAvaliado: Number(item.idAvaliado),
          idCiclo: convertCicloToNumber(item.idCiclo),
          nota: Number(item.nota),
          pontosFortes: item.pontosFortes,
          pontosMelhora: item.pontosMelhoria, // pontosMelhoria -> pontosMelhora
          nomeProjeto: item.nomeProjeto,
          periodoMeses: Number(item.periodoMeses) || 1,
          trabalhariaNovamente: MOTIVACAO_MAP[Number(item.trabalhariaNovamente)] || 'INDIFERENTE'
        };
        console.log(`Avaliação 360 ${index} convertida:`, converted);
        return converted;
      });

      // ✅ Usar endpoint /bulk em vez de individual
      const avaliacao360Bulk = {
        avaliacoes360: avaliacoes360
      };

      promises.push(
        fetch(`${API_BASE_URL}/avaliacao/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avaliacao360Bulk),
        })
      );
    }

    // 3. Enviar referências
    if (dados.referencias && Object.keys(dados.referencias).length > 0) {
      console.log('=== PROCESSANDO REFERÊNCIAS ===');
      const referenciasBulk = {
        referencias: Object.values(dados.referencias).map((item: any, index: number) => {
          const converted = {
            idReferenciador: Number(item.idAvaliador),
            idReferenciado: Number(item.idAvaliado),
            idCiclo: convertCicloToNumber(item.idCiclo),
            justificativa: item.justificativa
          };
          console.log(`Referência ${index} convertida:`, converted);
          return converted;
        })
      };

      promises.push(
        fetch(`${API_BASE_URL}/referencia/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(referenciasBulk),
        })
      );
    }

    // Executar todas as requisições
    const responses = await Promise.all(promises);

    // Verificar se todas foram bem-sucedidas
    for (const [index, response] of responses.entries()) {
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na requisição ${index}:`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          error: errorText
        });
        throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no envio:', error);
    throw error;
  }
}

// ✅ Nova função específica para enviar apenas Referências
export async function enviarReferencias(referenciasData: any) {
  try {
    console.log('=== ENVIANDO REFERÊNCIAS ===');
    console.log('Dados recebidos:', referenciasData);

    if (!referenciasData || Object.keys(referenciasData).length === 0) {
      throw new Error('Nenhuma referência para enviar');
    }

    // Converter dados para formato do backend
    const referencias = Object.values(referenciasData).map((item: any, index: number) => {
      console.log(`Processando referência ${index}:`, item);
      
      const converted = {
        idReferenciador: Number(item.idAvaliador),
        idReferenciado: Number(item.idAvaliado),
        idCiclo: convertCicloToNumber(item.idCiclo),
        justificativa: item.justificativa
      };
      
      console.log(`Referência ${index} convertida:`, converted);
      return converted;
    });

    // Preparar payload para o endpoint /bulk
    const bulkPayload = {
      referencias: referencias
    };

    console.log('Payload para /referencia/bulk:', JSON.stringify(bulkPayload, null, 2));

    // Enviar para o endpoint bulk
    const response = await fetch(`${API_BASE_URL}/referencia/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na requisição:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erro ao enviar referências: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Referências enviadas com sucesso:', result);
    
    return {
      success: true,
      data: result,
      message: `${referencias.length} referência(s) enviada(s) com sucesso!`
    };

  } catch (error) {
    console.error('❌ Erro no envio das referências:', error);
    throw error;
  }
}