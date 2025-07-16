const API_BASE_URL = "http://localhost:3000";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  trilhaId: number | null;
  idEquipe?: number | null;
  gestorId?: number | null;
  createdAt: string;
  updatedAt: string;
  trilha?: {
    id: number;
    name: string;
    enabled: boolean;
  } | null;
  equipe?: {
    id: number;
    nome: string;
    descricao?: string;
  } | null;
  mentor?: {
    id: number;
    name: string;
    email: string;
  } | null;
  mentorados?: {
    id: number;
    name: string;
    email: string;
  }[];
  // ❌ NÃO incluir: password: string;
}

export async function buscarUsuarios(): Promise<User[]> {
  try {
    console.log('🔍 Buscando usuários em:', `${API_BASE_URL}/users`);
    
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const users = await response.json();
    
    // ✅ Verificar se ainda tem password
    if (users.length > 0 && users[0].password) {
      console.error('❌ ERRO: Password ainda está vindo da API!');
      // ✅ Remover password no frontend como fallback
      const usersWithoutPassword = users.map((user: any) => {
        delete user.password;
        return user;
      });
      console.log('✅ Passwords removidas no frontend');
      return usersWithoutPassword;
    }
    
    console.log('✅ Usuários carregados sem password:', users);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    return [];
  }
}

export async function buscarUsuariosPorTermo(termo: string): Promise<User[]> {
  const users = await buscarUsuarios();
  
  if (!termo.trim()) return users;
  
  return users.filter(user =>
    user.name.toLowerCase().includes(termo.toLowerCase()) ||
    user.email.toLowerCase().includes(termo.toLowerCase())
  );
}

export async function buscarUsuariosPorEquipe(equipeId: number): Promise<User[]> {
  try {
    console.log('🔍 Buscando usuários da equipe:', equipeId);
    
    const response = await fetch(`${API_BASE_URL}/users/equipe/${equipeId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const users = await response.json();
    
    // ✅ Verificar se ainda tem password
    if (users.length > 0 && users[0].password) {
      console.error('❌ ERRO: Password ainda está vindo da API!');
      // ✅ Remover password no frontend como fallback
      const usersWithoutPassword = users.map((user: any) => {
        delete user.password;
        return user;
      });
      console.log('✅ Passwords removidas no frontend');
      return usersWithoutPassword;
    }
    
    console.log('✅ Usuários da equipe carregados:', users);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('❌ Erro ao buscar usuários da equipe:', error);
    return [];
  }
}

export async function getMembrosAndGestorByEquipe(equipeId: number): Promise<User[]> {
  try {
    console.log('🔍 Buscando membros e gestor da equipe:', equipeId);
    const response = await fetch(`${API_BASE_URL}/users/by-equipe-com-gestor/${equipeId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const users = await response.json();
    // Remover password se vier por engano
    if (users.length > 0 && users[0].password) {
      const usersWithoutPassword = users.map((user: any) => {
        delete user.password;
        return user;
      });
      return usersWithoutPassword;
    }
    console.log('✅ Membros e gestor da equipe carregados:', users);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('❌ Erro ao buscar membros e gestor da equipe:', error);
    return [];
  }
}

export async function buscarUsuariosPorGestor(gestorId: number): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/equipe/users-by-gestor/${gestorId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const users = await response.json();
    // Remover password se vier por engano
    if (users.length > 0 && users[0].password) {
      const usersWithoutPassword = users.map((user: User) => {
        // @ts-expect-error
        delete user.password;
        return user;
      });
      return usersWithoutPassword;
    }
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error('❌ Erro ao buscar usuários por gestor:', error);
    return [];
  }
}