// Tipos de Status
export type StatusAtendimento = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
export type StatusEquipamento = 'ativo' | 'inativo' | 'manutencao';
export type TipoManutencao = 'preventiva' | 'corretiva';

// Interface para Atendimento
export interface Atendimento {
  id: string;
  cliente: string;
  equipamento: string;
  tipo_servico: string;
  descricao: string;
  status: StatusAtendimento;
  data_inicio: string;
  data_fim?: string;
  tecnico: string;
  valor?: number;
  itens_utilizados?: ItemUtilizado[];
}

// Interface para Item Utilizado no Atendimento
export interface ItemUtilizado {
  peca_id: string;
  quantidade: number;
}

// Interface para Equipamento
export interface Equipamento {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  numero_serie: string;
  status: StatusEquipamento;
  data_aquisicao: string;
  localizacao: string;
  observacoes?: string;
}

// Interface para Manutenção
export interface Manutencao {
  id: string;
  equipamento_id: string;
  tipo: TipoManutencao;
  descricao: string;
  data: string;
  tecnico: string;
  custo?: number;
  pecas_utilizadas?: string[];
}

// Interface para Peça/Item do Estoque
export interface Peca {
  id: string;
  nome: string;
  descricao: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
  unidade: string;
  preco_unitario: number;
  fornecedor?: string;
}

// Interface para Compra
export interface Compra {
  id: string;
  data_compra: string;
  peca_id: string;
  quantidade_comprada: number;
  fornecedor: string;
  preco_total: number;
  preco_unitario: number;
}

// Interface para Estatísticas do Dashboard
export interface DashboardStats {
  total_atendimentos: number;
  atendimentos_pendentes: number;
  equipamentos_manutencao: number;
  pecas_estoque_baixo: number;
  atendimentos_por_status: { [key: string]: number };
  ultimos_atendimentos: Atendimento[];
}