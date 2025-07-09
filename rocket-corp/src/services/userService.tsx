const API_BASE_URL = "http://localhost:3000";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  trilhaId: number | null;
  createdAt: string;
  updatedAt: string;
  trilha?: {
    id: number;
    name: string;
    enabled: boolean;
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
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
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
    user.email.toLowerCase().includes(termo.toLowerCase()) ||
    user.unidade?.toLowerCase().includes(termo.toLowerCase())
  );
}