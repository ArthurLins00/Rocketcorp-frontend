import { apiFetch } from '../utils/api';

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

// ✅ Nova função específica para enviar apenas Avaliação 360
export async function enviarAvaliacao360(avaliacao360Data: Record<string, unknown>) {
  try {
    console.log('📤 Iniciando envio de Avaliação 360:', avaliacao360Data);
    
    // Adicionar verificação de nota
    if (avaliacao360Data.nota) {
      console.log('📝 Nota detectada na avaliação 360:', avaliacao360Data.nota);
    } else {
      console.warn('⚠️ Avaliação 360 sem nota!');
    }
    
    const payload = {
      idAvaliador: Number(avaliacao360Data.idAvaliador),
      idAvaliado: Number(avaliacao360Data.idAvaliado),
      idCiclo: convertCicloToNumber(avaliacao360Data.idCiclo as string),
      pontosFortes: avaliacao360Data.pontosFortes as string,
      pontosMelhora: (avaliacao360Data.pontosMelhora || avaliacao360Data.pontosMelhoria || '') as string,
      nomeProjeto: avaliacao360Data.nomeProjeto as string,
      periodoMeses: Number(avaliacao360Data.periodoMeses),
      trabalhariaNovamente: convertTrabalhariaToEnum(avaliacao360Data.trabalhariaNovamente),
      // Adicionar nota se existir
      nota: avaliacao360Data.nota ? Number(avaliacao360Data.nota) : undefined
    };
    
    console.log('📤 Enviando payload Avaliação 360:', payload);
    
    const response = await apiFetch('/avaliacao/360', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha ao enviar avaliação 360: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Avaliação 360 enviada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('❌ Erro ao enviar avaliação 360:', error);
    throw error;
  }
}

export async function enviarAvaliacao(dados: Record<string, unknown>) {
  try {
    console.log('=== DADOS RECEBIDOS PARA ENVIO ===');
    console.log('Autoavaliação:', dados.autoavaliacao);
    console.log('Avaliação 360:', dados.avaliacao360);
    console.log('Referências:', dados.referencias);
    
    if (dados.autoavaliacao && Array.isArray(dados.autoavaliacao) && dados.autoavaliacao.length > 0) {
      console.log('Primeira autoavaliação:', dados.autoavaliacao[0]);
      console.log('CriterioId original:', (dados.autoavaliacao[0] as Record<string, unknown>)?.criterioId);
    }
    
    const promises: Promise<Response>[] = [];

    // 1. ✅ Enviar autoavaliações usando o formato correto do BulkCreateAvaliacaoDto
    if (dados.autoavaliacao && Array.isArray(dados.autoavaliacao) && dados.autoavaliacao.length > 0) {
      console.log('=== PROCESSANDO AUTOAVALIAÇÕES ===');
      const avaliacoesBulk = (dados.autoavaliacao as Record<string, unknown>[]).map((item: Record<string, unknown>, index: number) => {
        console.log(`Item ${index} original:`, item);
        
        const converted = {
          idUser: Number(item.idAvaliador), // ✅ CORRIGIDO: idAvaliador -> idUser
          idCiclo: convertCicloToNumber(item.idCiclo as string),
          criterioId: Number(item.criterioId), // ✅ Usar o ID diretamente
          nota: Number(item.nota),
          justificativa: item.justificativa as string
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
        apiFetch('/avaliacao/bulk', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
        })
      );
    }

    // 2. ✅ Enviar avaliações 360 usando o formato correto do BulkCreateAvaliacaoDto
    if (dados.avaliacao360 && typeof dados.avaliacao360 === 'object' && Object.keys(dados.avaliacao360 as Record<string, unknown>).length > 0) {
      console.log('=== PROCESSANDO AVALIAÇÕES 360 ===');
      const avaliacoes360 = Object.values(dados.avaliacao360 as Record<string, unknown>).map((item: unknown, index: number) => {
        const itemRecord = item as Record<string, unknown>;
        const converted = {
          idAvaliador: Number(itemRecord.idAvaliador),
          idAvaliado: Number(itemRecord.idAvaliado),
          idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
          nota: Number(itemRecord.nota),
          pontosFortes: itemRecord.pontosFortes as string,
          pontosMelhora: itemRecord.pontosMelhoria as string, // ✅ CORRIGIDO: pontosMelhoria -> pontosMelhora
          nomeProjeto: itemRecord.nomeProjeto as string,
          periodoMeses: Number(itemRecord.periodoMeses) || 1,
          trabalhariaNovamente: MOTIVACAO_MAP[Number(itemRecord.trabalhariaNovamente)] || 'INDIFERENTE'
        };
        console.log(`Avaliação 360 ${index} convertida:`, converted);
        return converted;
      });

      // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
      const bulkPayload = {
        avaliacoes360: avaliacoes360
      };
      
      promises.push(
        apiFetch('/avaliacao/bulk', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bulkPayload), // Enviar com a estrutura correta
        })
      );
    }

    // 3. ✅ Enviar referências usando o endpoint separado
    if (dados.referencias && typeof dados.referencias === 'object' && Object.keys(dados.referencias as Record<string, unknown>).length > 0) {
      console.log('=== PROCESSANDO REFERÊNCIAS ===');
      const referencias = Object.values(dados.referencias as Record<string, unknown>).map((item: unknown, index: number) => {
        const itemRecord = item as Record<string, unknown>;
        const converted = {
          idReferenciador: Number(itemRecord.idAvaliador),
          idReferenciado: Number(itemRecord.idAvaliado),
          idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
          justificativa: itemRecord.justificativa as string
        };
        console.log(`Referência ${index} convertida:`, converted);
        return converted;
      });

      // ✅ Enviar para o endpoint de referências
      promises.push(
        apiFetch('/referencia/bulk', {
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
export async function enviarReferencias(referenciasData: Record<string, unknown>) {
  try {
    console.log('=== ENVIANDO REFERÊNCIAS ===');
    console.log('Dados recebidos:', referenciasData);

    if (!referenciasData || Object.keys(referenciasData).length === 0) {
      throw new Error('Nenhuma referência para enviar');
    }

    // Converter dados para formato do backend
    const referencias = Object.values(referenciasData).map((item: unknown, index: number) => {
      const itemRecord = item as Record<string, unknown>;
      console.log(`Processando referência ${index}:`, itemRecord);
      
      const converted = {
        idReferenciador: Number(itemRecord.idAvaliador),
        idReferenciado: Number(itemRecord.idAvaliado),
        idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
        justificativa: itemRecord.justificativa as string
      };
      
      console.log(`Referência ${index} convertida:`, converted);
      return converted;
    });

    console.log('Enviando referências em lote...');

    // ✅ Enviar para o endpoint bulk de referências
    const response = await apiFetch('/referencia/bulk', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(referencias), // Enviar array de referências
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro no envio das referências:`, {
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

// ✅ Nova função específica para enviar apenas Mentoring
export async function enviarMentoring(mentoringData: Record<string, unknown>) {
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
      idCiclo: convertCicloToNumber(mentoringData.idCiclo as string),
      nota: Number(mentoringData.nota),
      justificativa: mentoringData.justificativa as string
    };

    console.log('Mentoring convertido:', mentoringAvaliacao);

    // ✅ Enviar no formato correto do BulkCreateAvaliacaoDto
    const bulkPayload = {
      mentoring: [mentoringAvaliacao]
    };

    console.log('Payload para /avaliacao/bulk:', JSON.stringify(bulkPayload, null, 2));

    // Enviar para o endpoint bulk
    const response = await apiFetch('/avaliacao/bulk', {
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
export async function enviarTodasAvaliacoes() {
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
    const payload: Record<string, unknown> = {};

    // ✅ Processar autoavaliações
    if (rawAuto && Object.keys(rawAuto).length > 0) {
      const autoavaliacoes = Object.entries(rawAuto)
        .filter(([, item]) => {
          const itemRecord = item as Record<string, unknown>;
          
          // ✅ Usar a mesma lógica do AutoavaliacaoForm: filtrar apenas itens preenchidos
          const notaValida = Number(itemRecord.nota) > 0;
          const justificativaValida = itemRecord.justificativa && 
                                     (itemRecord.justificativa as string).trim().length > 0;
          const criterioIdValido = itemRecord.criterioId !== undefined;
          
          const isValid = notaValida && justificativaValida && criterioIdValido;
          
          if (!isValid) {
            console.log(`⚠️ Autoavaliação não preenchida - criterioId: ${itemRecord.criterioId} (nota: ${itemRecord.nota}, justificativa: "${itemRecord.justificativa}")`);
          }
          
          return isValid;
        })
        .map(([, item]) => {
          const itemRecord = item as Record<string, unknown>;
          return {
            idUser: Number(itemRecord.idAvaliador), // ✅ CORRIGIDO: idAvaliador -> idUser
            idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
            nota: Number(itemRecord.nota),
            justificativa: itemRecord.justificativa as string,
            criterioId: Number(itemRecord.criterioId), // Usar o ID diretamente sem mapeamento
          };
        });
      
      if (autoavaliacoes.length > 0) {
        payload.autoavaliacoes = autoavaliacoes;
        console.log('✅ Autoavaliações preparadas:', autoavaliacoes.length);
        console.log('🔍 Primeira autoavaliação:', autoavaliacoes[0]);
        console.log('📊 CriterioIds enviados:', autoavaliacoes.map(a => a.criterioId));
      } else {
        console.log('⚠️ Nenhuma autoavaliação válida encontrada - verifique se preencheu nota e justificativa');
      }
    }

    // ✅ Processar avaliações 360
    if (rawAvaliacao360 && Object.keys(rawAvaliacao360).length > 0) {
      const avaliacoes360 = Object.entries(rawAvaliacao360)
        .filter(([, item]) => {
          const itemRecord = item as Record<string, unknown>;
          
          // ✅ Validar campos obrigatórios da avaliação 360
          const pontosFortesValido = itemRecord.pontosFortes && 
                                    (itemRecord.pontosFortes as string).trim().length > 0;
          const trabalhariaNovamenteValido = itemRecord.trabalhariaNovamente !== undefined;
          const notaValida = itemRecord.nota && Number(itemRecord.nota) > 0;
          
          const isValid = pontosFortesValido && trabalhariaNovamenteValido && notaValida;
          
          if (!isValid) {
            console.log(`⚠️ Avaliação 360 não preenchida - avaliado: ${itemRecord.idAvaliado} (pontosFortes: "${itemRecord.pontosFortes}", trabalhariaNovamente: ${itemRecord.trabalhariaNovamente}, nota: ${itemRecord.nota})`);
          }
          
          return isValid;
        })
        .map(([, item]) => {
          const itemRecord = item as Record<string, unknown>;
          return {
            idAvaliador: Number(itemRecord.idAvaliador),
            idAvaliado: Number(itemRecord.idAvaliado),
            idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
            pontosFortes: itemRecord.pontosFortes as string,
            pontosMelhora: (itemRecord.pontosMelhora || itemRecord.pontosMelhoria || '') as string, // ✅ CORRIGIDO: pontosMelhoria -> pontosMelhora
            nomeProjeto: itemRecord.nomeProjeto as string,
            periodoMeses: Number(itemRecord.periodoMeses),
            trabalhariaNovamente: convertTrabalhariaToEnum(itemRecord.trabalhariaNovamente),
            // Adicionar a nota se estiver presente
            nota: itemRecord.nota ? Number(itemRecord.nota) : undefined
          };
        });
  
      if (avaliacoes360.length > 0) {
        payload.avaliacoes360 = avaliacoes360;
        console.log('✅ Avaliações 360 preparadas:', avaliacoes360.length);
        console.log('🔍 Primeira avaliação 360:', avaliacoes360[0]);
        
        // Verificar se tem nota
        const temNota = avaliacoes360.some(a => a.nota !== undefined);
        if (temNota) {
          console.log('📊 Notas das avaliações 360:', avaliacoes360.map(a => a.nota));
        } else {
          console.warn('⚠️ Nenhuma avaliação 360 possui nota');
        }
      } else {
        console.log('⚠️ Nenhuma avaliação 360 válida encontrada - verifique se preencheu todos os campos obrigatórios');
      }
    }

    // ✅ Processar mentoring
    if (rawMentoring && Object.keys(rawMentoring).length > 0) {
      const mentoringArray = Array.isArray(rawMentoring) ? rawMentoring : [rawMentoring];
      
      const mentoring = mentoringArray
        .filter((item: Record<string, unknown>) => {
          // ✅ Validar campos obrigatórios do mentoring
          const idAvaliadorValido = item.idAvaliador && item.idAvaliador !== null;
          const idAvaliadoValido = item.idAvaliado && item.idAvaliado !== null;
          const notaValida = item.nota && Number(item.nota) > 0;
          const justificativaValida = item.justificativa && 
                                     (item.justificativa as string).trim().length > 0;
          
          const isValid = idAvaliadorValido && idAvaliadoValido && notaValida && justificativaValida;
          
          if (!isValid) {
            console.log(`⚠️ Mentoring não preenchido - mentor: ${item.idAvaliado} (idAvaliador: ${item.idAvaliador}, idAvaliado: ${item.idAvaliado}, nota: ${item.nota}, justificativa: "${item.justificativa}")`);
          }
          
          return isValid;
        })
        .map((item: Record<string, unknown>) => ({
          idMentor: Number(item.idAvaliado),
          idMentorado: Number(item.idAvaliador),
          idCiclo: convertCicloToNumber(item.idCiclo as string),
          nota: Number(item.nota),
          justificativa: item.justificativa as string,
        }));

      if (mentoring.length > 0) {
        payload.mentoring = mentoring;
        console.log('✅ Mentoring preparado:', mentoring.length);
        console.log('🔍 Primeiro mentoring:', mentoring[0]);
      } else {
        console.log('⚠️ Nenhum mentoring válido encontrado - verifique se preencheu nota e justificativa');
      }
    }

    // 🚨 Verificar se há dados válidos para enviar
    if (!payload.autoavaliacoes && !payload.avaliacoes360 && !payload.mentoring) {
      throw new Error('Nenhuma avaliação válida encontrada para enviar. Verifique se todos os campos obrigatórios foram preenchidos.');
    }

    console.log('📦 Payload final:', JSON.stringify(payload, null, 2));

    // 🚀 Enviar avaliações para o backend
    const response = await apiFetch('/avaliacao/bulk', {
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
          .filter((item: unknown) => {
            const itemRecord = item as Record<string, unknown>;
            
            // ✅ Validar campos obrigatórios das referências
            const idAvaliadorValido = itemRecord.idAvaliador && itemRecord.idAvaliador !== null;
            const idAvaliadoValido = itemRecord.idAvaliado && itemRecord.idAvaliado !== null;
            const justificativaValida = itemRecord.justificativa && 
                                       (itemRecord.justificativa as string).trim().length > 0;
            
            const isValid = idAvaliadorValido && idAvaliadoValido && justificativaValida;
            
            if (!isValid) {
              console.log(`⚠️ Referência não preenchida - referenciado: ${itemRecord.idAvaliado} (idAvaliador: ${itemRecord.idAvaliador}, idAvaliado: ${itemRecord.idAvaliado}, justificativa: "${itemRecord.justificativa}")`);
            }
            
            return isValid;
          })
          .map((item: unknown) => {
            const itemRecord = item as Record<string, unknown>;
            return {
              idReferenciador: Number(itemRecord.idAvaliador),
              idReferenciado: Number(itemRecord.idAvaliado),
              idCiclo: convertCicloToNumber(itemRecord.idCiclo as string),
              justificativa: itemRecord.justificativa as string,
            };
          });

        if (referencias.length > 0) {
          console.log('📝 Referências preparadas:', referencias.length);
          console.log('🔍 Primeira referência:', referencias[0]);

          // ✅ Enviar para o endpoint bulk de referências
          console.log('🔐 Verificando token de autenticação...');
          const token = localStorage.getItem('token');
          console.log('🔑 Token presente:', !!token);
          
          const refResponse = await apiFetch('/referencia/bulk', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referencias }),
          });

          console.log('📡 Resposta do servidor:', {
            status: refResponse.status,
            statusText: refResponse.statusText,
            ok: refResponse.ok
          });

          if (!refResponse.ok) {
            const errorText = await refResponse.text();
            console.error(`Erro no envio das referências:`, {
              status: refResponse.status,
              statusText: refResponse.statusText,
              error: errorText
            });
            throw new Error(`Erro ao enviar referências: ${refResponse.status} - ${errorText}`);
          }

          referenciasResult = await refResponse.json();
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
    
    // ✅ Limpar referências se foram enviadas com sucesso
    if (rawReferencias && Object.keys(rawReferencias).length > 0 && referenciasResult) {
      console.log('🧹 Limpando localStorage das referências enviadas');
      localStorage.removeItem("referencias");
    }

    const totalItens = ((payload.autoavaliacoes as unknown[])?.length || 0) + 
                       ((payload.avaliacoes360 as unknown[])?.length || 0) + 
                       ((payload.mentoring as unknown[])?.length || 0) +
                       (referenciasResult?.count || 0); // ✅ Usar count em vez de length

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
function convertTrabalhariaToEnum(value: unknown): string {
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

// ✅ Função para testar o endpoint de referências diretamente
export async function testarReferencias() {
  try {
    console.log('🧪 Testando endpoint de referências...');
    
    const testData = {
      referencias: [
        {
          idReferenciador: 6,
          idReferenciado: 1,
          idCiclo: 1,
          justificativa: "Teste de referência via frontend"
        }
      ]
    };
    
    console.log('📦 Dados de teste:', testData);
    
    const response = await apiFetch('/referencia/bulk', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });
    
    console.log('📡 Resposta do teste:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Teste bem-sucedido:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Erro no teste:', errorText);
      throw new Error(`Erro no teste: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Erro no teste de referências:', error);
    throw error;
  }
}