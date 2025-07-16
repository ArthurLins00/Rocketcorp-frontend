import { apiFetch } from '../utils/api';

export interface Log {
  id: number;
  userId: number;
  action: string;
  entity: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export async function getRecentLogs(): Promise<Log[]> {
  try {
    const response = await apiFetch('/logs/recent');
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao buscar logs: ${response.status} - ${errorBody}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar logs do backend:', error);
    throw error;
  }
} 