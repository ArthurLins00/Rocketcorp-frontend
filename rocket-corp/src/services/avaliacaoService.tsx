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

    // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
    const bulkPayload = {
      avaliacoes360: avaliacoes360
    };

    console.log('Payload para /avaliacao/bulk:', JSON.stringify(bulkPayload, null, 2));

    // Enviar para o endpoint bulk
    const response = await fetch(`${API_BASE_URL}/avaliacao/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
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

    // 1. Enviar autoavaliações usando o formato correto do BulkCreateAvaliacaoDto
    if (dados.autoavaliacao && dados.autoavaliacao.length > 0) {
      console.log('=== PROCESSANDO AUTOAVALIAÇÕES ===');
      const avaliacoesBulk = dados.autoavaliacao.map((item: any, index: number) => {
        console.log(`Item ${index} original:`, item);
        
        const converted = {
          idAvaliador: Number(item.idAvaliador), // Converter para número
          idAvaliado: Number(item.idAvaliador),  // Para autoavaliação, mesmo ID
          idCiclo: convertCicloToNumber(item.idCiclo),
          criterioId: getCriterioId(item.criterioId),
          nota: Number(item.nota),
          justificativa: item.justificativa
        };
        
        console.log(`Autoavaliação ${index} convertida:`, converted);
        return converted;
      });

      // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
      const bulkPayload = {
        autoavaliacoes: avaliacoesBulk
      };
      
      console.log('Payload para /avaliacao/bulk:', JSON.stringify(bulkPayload, null, 2));
      
      promises.push(
        fetch(`${API_BASE_URL}/avaliacao/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
        })
      );
    }

    // 2. ✅ Enviar avaliações 360 usando o formato correto do BulkCreateAvaliacaoDto
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

      // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
      const bulkPayload = {
        avaliacoes360: avaliacoes360
      };
      
      promises.push(
        fetch(`${API_BASE_URL}/avaliacao/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
        })
      );
    }

    // 3. Enviar referências (mantém o mesmo formato pois tem endpoint próprio)
    if (dados.referencias && Object.keys(dados.referencias).length > 0) {
      console.log('=== PROCESSANDO REFERÊNCIAS ===');
      const referencias = Object.values(dados.referencias).map((item: any, index: number) => {
        const converted = {
          idReferenciador: Number(item.idAvaliador),
          idReferenciado: Number(item.idAvaliado),
          idCiclo: convertCicloToNumber(item.idCiclo),
          justificativa: item.justificativa
        };
        console.log(`Referência ${index} convertida:`, converted);
        return converted;
      });

      promises.push(
        fetch(`${API_BASE_URL}/referencia/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(referencias), // Referências mantém formato array
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

    console.log('Enviando referências individualmente...');

    // Enviar cada referência individualmente
    const promises = referencias.map(async (referencia, index) => {
      console.log(`Enviando referência ${index}:`, referencia);
      
      const response = await fetch(`${API_BASE_URL}/referencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(referencia), // Enviar cada referência individualmente
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na referência ${index}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Erro ao enviar referência ${index}: ${response.status} - ${errorText}`);
      }

      return response.json();
    });

    // Aguardar todas as requisições
    const results = await Promise.all(promises);
    console.log('✅ Todas as referências enviadas com sucesso:', results);
    
    return {
      success: true,
      data: results,
      message: `${referencias.length} referência(s) enviada(s) com sucesso!`
    };

  } catch (error) {
    console.error('❌ Erro no envio das referências:', error);
    throw error;
  }
}

// ✅ Nova função específica para enviar apenas Mentoring
export async function enviarMentoring(mentoringData: any) {
  try {
    console.log('=== ENVIANDO MENTORING ===');
    console.log('Dados recebidos:', mentoringData);

    if (!mentoringData || !mentoringData.idAvaliado || mentoringData.idAvaliado === "") {
      throw new Error('Nenhuma avaliação de mentoring para enviar');
    }

    // ✅ Converter dados para formato de mentoring
    const mentoringAvaliacao = {
      idMentor: Number(mentoringData.idAvaliado), // mentor sendo avaliado
      idMentorado: Number(mentoringData.idAvaliador), // mentorado avaliando
      idCiclo: convertCicloToNumber(mentoringData.idCiclo),
      nota: Number(mentoringData.nota),
      justificativa: mentoringData.justificativa
    };

    console.log('Mentoring convertido:', mentoringAvaliacao);

    // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
    const bulkPayload = {
      mentoring: [mentoringAvaliacao]
    };

    console.log('Payload para /avaliacao/bulk:', JSON.stringify(bulkPayload, null, 2));

    // Enviar para o endpoint bulk
    const response = await fetch(`${API_BASE_URL}/avaliacao/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na requisição:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erro ao enviar avaliação de mentoring: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Avaliação de mentoring enviada com sucesso:', result);
    
    return {
      success: true,
      data: result,
      message: 'Avaliação de mentoring enviada com sucesso!'
    };

  } catch (error) {
    console.error('❌ Erro no envio da avaliação de mentoring:', error);
    throw error;
  }
}

/**
 * Envia TODAS as avaliações de uma vez usando o endpoint /avaliacao/bulk
 */
export async function enviarTodasAvaliacoes(idCiclo: string) {
  try {
    console.log('=== ENVIANDO TODAS AS AVALIAÇÕES ===');
    
    // 🔄 Coletar dados do localStorage
    const rawAuto = JSON.parse(localStorage.getItem("autoavaliacao") || "{}");
    const rawAvaliacao360 = JSON.parse(localStorage.getItem("avaliacao360") || "{}");
    const rawMentoring = JSON.parse(localStorage.getItem("mentoring") || "{}");
    const rawReferencias = JSON.parse(localStorage.getItem("referencias") || "{}"); // ✅ Adicionar referências
    
    console.log('🔍 Dados brutos do localStorage:');
    console.log('📝 Autoavaliações:', rawAuto);
    console.log('📝 Avaliações 360:', rawAvaliacao360);
    console.log('📝 Mentoring:', rawMentoring);
    console.log('📝 Referências:', rawReferencias); // ✅ Log das referências

    // 🔄 Preparar payload unificado
    const payload: any = {};

    // ✅ Processar autoavaliações
    if (rawAuto && Object.keys(rawAuto).length > 0) {
      const autoavaliacoes = Object.entries(rawAuto)
        .filter(([key, item]: [string, any]) => {
          const isValid = item.criterioId && 
                         item.criterioId !== null && 
                         item.criterioId !== undefined && 
                         item.criterioId !== 'null' && 
                         item.criterioId !== 'undefined';
          
          if (!isValid) {
            console.log(`⚠️ Autoavaliação ${key} inválida - criterioId:`, item.criterioId);
          }
          
          return isValid;
        })
        .map(([key, item]: [string, any]) => ({
          idAvaliador: Number(item.idAvaliador),
          idAvaliado: Number(item.idAvaliado),
          idCiclo: convertCicloToNumber(item.idCiclo),
          nota: Number(item.nota),
          justificativa: item.justificativa,
          criterioId: getCriterioId(item.criterioId),
        }));
      
      if (autoavaliacoes.length > 0) {
        payload.autoavaliacoes = autoavaliacoes;
        console.log('✅ Autoavaliações preparadas:', autoavaliacoes.length);
        console.log('🔍 Primeira autoavaliação:', autoavaliacoes[0]);
      } else {
        console.log('⚠️ Nenhuma autoavaliação válida encontrada');
      }
    }

    // ✅ Processar avaliações 360
    if (rawAvaliacao360 && Object.keys(rawAvaliacao360).length > 0) {
      const avaliacoes360 = Object.entries(rawAvaliacao360)
        .filter(([key, item]: [string, any]) => {
          const isValid = item.pontosFortes && 
                     item.trabalhariaNovamente !== undefined;
          
          if (!isValid) {
            console.log(`⚠️ Avaliação 360 ${key} inválida:`, {
              pontosFortes: item.pontosFortes,
              pontosMelhora: item.pontosMelhora,
              trabalhariaNovamente: item.trabalhariaNovamente
            });
          }
          
          return isValid;
        })
        .map(([key, item]: [string, any]) => ({
          idAvaliador: Number(item.idAvaliador),
          idAvaliado: Number(item.idAvaliado),
          idCiclo: convertCicloToNumber(item.idCiclo),
          pontosFortes: item.pontosFortes,
          pontosMelhora: item.pontosMelhora || item.pontosMelhoria || '',
          nomeProjeto: item.nomeProjeto,
          periodoMeses: Number(item.periodoMeses),
          trabalhariaNovamente: convertTrabalhariaToEnum(item.trabalhariaNovamente),
        }));

      if (avaliacoes360.length > 0) {
        payload.avaliacoes360 = avaliacoes360;
        console.log('✅ Avaliações 360 preparadas:', avaliacoes360.length);
        console.log('🔍 Primeira avaliação 360:', avaliacoes360[0]);
      } else {
        console.log('⚠️ Nenhuma avaliação 360 válida encontrada');
      }
    }

    // ✅ Processar mentoring
    if (rawMentoring && Object.keys(rawMentoring).length > 0) {
      const mentoringArray = Array.isArray(rawMentoring) ? rawMentoring : [rawMentoring];
      
      const mentoring = mentoringArray
        .filter((item: any) => {
          const isValid = item.idAvaliador && 
                         item.idAvaliado && 
                         item.nota && 
                         item.justificativa &&
                         item.idAvaliador !== null &&
                         item.idAvaliado !== null &&
                         item.nota !== null;
          
          if (!isValid) {
            console.log(`⚠️ Mentoring inválido:`, {
              idAvaliador: item.idAvaliador,
              idAvaliado: item.idAvaliado,
              nota: item.nota,
              justificativa: item.justificativa
            });
          }
          
          return isValid;
        })
        .map((item: any) => ({
          idMentor: Number(item.idAvaliado),
          idMentorado: Number(item.idAvaliador),
          idCiclo: convertCicloToNumber(item.idCiclo),
          nota: Number(item.nota),
          justificativa: item.justificativa,
        }));

      if (mentoring.length > 0) {
        payload.mentoring = mentoring;
        console.log('✅ Mentoring preparado:', mentoring.length);
        console.log('🔍 Primeiro mentoring:', mentoring[0]);
      } else {
        console.log('⚠️ Nenhum mentoring válido encontrado');
      }
    }

    // 🚨 Verificar se há dados válidos para enviar
    if (!payload.autoavaliacoes && !payload.avaliacoes360 && !payload.mentoring) {
      throw new Error('Nenhuma avaliação válida encontrada para enviar. Verifique se todos os campos obrigatórios foram preenchidos.');
    }

    console.log('📦 Payload final:', JSON.stringify(payload, null, 2));

    // 🚀 Enviar avaliações para o backend
    const response = await fetch(`${API_BASE_URL}/avaliacao/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      throw new Error(`Erro ao enviar avaliações: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Todas as avaliações enviadas com sucesso:', result);

    // ✅ Enviar referências separadamente (se existirem)
    let referenciasResult = null;
    if (rawReferencias && Object.keys(rawReferencias).length > 0) {
      console.log('🔄 Enviando referências...');
      
      try {
        const referencias = Object.values(rawReferencias)
          .filter((item: any) => {
            const isValid = item.idAvaliador && 
                           item.idAvaliado && 
                           item.justificativa &&
                           item.idAvaliador !== null &&
                           item.idAvaliado !== null;
            
            if (!isValid) {
              console.log(`⚠️ Referência inválida:`, {
                idAvaliador: item.idAvaliador,
                idAvaliado: item.idAvaliado,
                justificativa: item.justificativa
              });
            }
            
            return isValid;
          })
          .map((item: any) => ({
            idReferenciador: Number(item.idAvaliador),
            idReferenciado: Number(item.idAvaliado),
            idCiclo: convertCicloToNumber(item.idCiclo),
            justificativa: item.justificativa,
          }));

        if (referencias.length > 0) {
          console.log('📝 Referências preparadas:', referencias.length);
          console.log('🔍 Primeira referência:', referencias[0]);

          // Enviar referências individualmente
          const referenciaPromises = referencias.map(async (referencia, index) => {
            console.log(`Enviando referência ${index}:`, referencia);
            
            const refResponse = await fetch(`${API_BASE_URL}/referencia`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(referencia),
            });

            if (!refResponse.ok) {
              const errorText = await refResponse.text();
              console.error(`Erro na referência ${index}:`, {
                status: refResponse.status,
                statusText: refResponse.statusText,
                error: errorText
              });
              throw new Error(`Erro ao enviar referência ${index}: ${refResponse.status} - ${errorText}`);
            }

            return refResponse.json();
          });

          // Aguardar todas as referências
          referenciasResult = await Promise.all(referenciaPromises);
          console.log('✅ Referências enviadas com sucesso:', referenciasResult);
        } else {
          console.log('⚠️ Nenhuma referência válida encontrada');
        }
      } catch (error) {
        console.error('❌ Erro ao enviar referências:', error);
        // Não falhar tudo se só as referências falharem
        console.log('⚠️ Continuando apesar do erro nas referências...');
      }
    }

    // 🧹 Limpar localStorage apenas se tudo foi enviado com sucesso
    if (payload.autoavaliacoes) localStorage.removeItem("autoavaliacao");
    if (payload.avaliacoes360) localStorage.removeItem("avaliacao360");
    if (payload.mentoring) localStorage.removeItem("mentoring");
    if (referenciasResult) localStorage.removeItem("referencias"); // ✅ Limpar referências se enviadas

    const totalItens = (payload.autoavaliacoes?.length || 0) + 
                       (payload.avaliacoes360?.length || 0) + 
                       (payload.mentoring?.length || 0) +
                       (referenciasResult?.length || 0); // ✅ Incluir referências no total

    return {
      success: true,
      data: {
        avaliacoes: result,
        referencias: referenciasResult
      },
      message: `Avaliações enviadas com sucesso! (${totalItens} itens)` // ✅ Incluir referências na mensagem
    };

  } catch (error) {
    console.error('❌ Erro no envio unificado:', error);
    throw error;
  }
}

// ✅ Função para converter trabalharia novamente para enum
function convertTrabalhariaToEnum(value: any): string {
  if (typeof value === 'number') {
    switch (value) {
      case 1: return 'DISCORDO_TOTALMENTE';
      case 2: return 'DISCORDO_PARCIALMENTE';
      case 3: return 'INDIFERENTE';
      case 4: return 'CONCORDO_PARCIALMENTE';
      case 5: return 'CONCORDO_TOTALMENTE';
      default: return 'INDIFERENTE';
    }
  }
  
  // Se já for string, retornar como está
  if (typeof value === 'string') {
    return value;
  }
  
  // Valor padrão
  return 'INDIFERENTE';
}