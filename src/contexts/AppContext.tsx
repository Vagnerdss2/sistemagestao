import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Atendimento, Equipamento, Manutencao, Peca, Compra, DashboardStats } from '../types';

interface AppContextType {
  atendimentos: Atendimento[];
  equipamentos: Equipamento[];
  manutencoes: Manutencao[];
  pecas: Peca[];
  compras: Compra[];
  addAtendimento: (atendimento: Omit<Atendimento, 'id'>) => void;
  updateAtendimento: (id: string, atendimento: Partial<Atendimento>) => void;
  deleteAtendimento: (id: string) => void;
  addEquipamento: (equipamento: Omit<Equipamento, 'id'>) => void;
  updateEquipamento: (id: string, equipamento: Partial<Equipamento>) => void;
  deleteEquipamento: (id: string) => void;
  addManutencao: (manutencao: Omit<Manutencao, 'id'>) => void;
  addPeca: (peca: Omit<Peca, 'id'>) => void;
  updatePeca: (id: string, peca: Partial<Peca>) => void;
  addCompra: (compra: Omit<Compra, 'id'>) => void;
  getDashboardStats: () => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([
    {
      id: '1',
      cliente: 'João Silva',
      equipamento: 'Compressor de Ar',
      tipo_servico: 'Manutenção Preventiva',
      descricao: 'Troca de filtros e verificação geral',
      status: 'concluido',
      data_inicio: '2024-12-01',
      data_fim: '2024-12-01',
      tecnico: 'Carlos Santos',
      valor: 350
    },
    {
      id: '2',
      cliente: 'Maria Oliveira',
      equipamento: 'Bomba Centrífuga',
      tipo_servico: 'Reparo',
      descricao: 'Reparo em vazamento no selo mecânico',
      status: 'em_andamento',
      data_inicio: '2024-12-15',
      tecnico: 'Ana Costa'
    }
  ]);

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([
    {
      id: '1',
      nome: 'Compressor de Ar Atlas Copco',
      marca: 'Atlas Copco',
      modelo: 'GA30VSD',
      numero_serie: 'AC001234',
      status: 'ativo',
      data_aquisicao: '2023-01-15',
      localizacao: 'Setor A'
    },
    {
      id: '2',
      nome: 'Bomba Centrífuga KSB',
      marca: 'KSB',
      modelo: 'Etanorm 125',
      numero_serie: 'KSB005678',
      status: 'manutencao',
      data_aquisicao: '2023-03-20',
      localizacao: 'Setor B'
    }
  ]);

  const [manutencoes, setManutencoes] = useState<Manutencao[]>([
    {
      id: '1',
      equipamento_id: '1',
      tipo: 'preventiva',
      descricao: 'Troca de filtros e verificação geral do compressor',
      data: '2024-12-01',
      tecnico: 'Carlos Santos',
      custo: 350,
      pecas_utilizadas: ['1', '2']
    }
  ]);

  const [pecas, setPecas] = useState<Peca[]>([
    {
      id: '1',
      nome: 'Filtro de Ar',
      descricao: 'Filtro de ar para compressores Atlas Copco',
      quantidade_disponivel: 15,
      quantidade_minima: 5,
      unidade: 'unidade',
      preco_unitario: 85
    },
    {
      id: '2',
      nome: 'Óleo Lubrificante',
      descricao: 'Óleo sintético para compressores',
      quantidade_disponivel: 3,
      quantidade_minima: 10,
      unidade: 'litro',
      preco_unitario: 45
    }
  ]);

  const [compras, setCompras] = useState<Compra[]>([
    {
      id: '1',
      data_compra: '2024-12-10',
      peca_id: '1',
      quantidade_comprada: 20,
      fornecedor: 'Atlas Copco Brasil',
      preco_total: 1700,
      preco_unitario: 85
    }
  ]);

  const addAtendimento = (atendimento: Omit<Atendimento, 'id'>) => {
    const novoAtendimento = { ...atendimento, id: generateId() };
    setAtendimentos(prev => [...prev, novoAtendimento]);
    
    // Baixar itens do estoque se foram utilizados
    if (atendimento.itens_utilizados) {
      atendimento.itens_utilizados.forEach(item => {
        setPecas(prev => prev.map(peca => 
          peca.id === item.peca_id 
            ? { ...peca, quantidade_disponivel: Math.max(0, peca.quantidade_disponivel - item.quantidade) }
            : peca
        ));
      });
    }
  };

  const updateAtendimento = (id: string, atendimento: Partial<Atendimento>) => {
    setAtendimentos(prev => prev.map(item => item.id === id ? { ...item, ...atendimento } : item));
  };

  const deleteAtendimento = (id: string) => {
    setAtendimentos(prev => prev.filter(item => item.id !== id));
  };

  const addEquipamento = (equipamento: Omit<Equipamento, 'id'>) => {
    setEquipamentos(prev => [...prev, { ...equipamento, id: generateId() }]);
  };

  const updateEquipamento = (id: string, equipamento: Partial<Equipamento>) => {
    setEquipamentos(prev => prev.map(item => item.id === id ? { ...item, ...equipamento } : item));
  };

  const deleteEquipamento = (id: string) => {
    setEquipamentos(prev => prev.filter(item => item.id !== id));
  };

  const addManutencao = (manutencao: Omit<Manutencao, 'id'>) => {
    setManutencoes(prev => [...prev, { ...manutencao, id: generateId() }]);
  };

  const addPeca = (peca: Omit<Peca, 'id'>) => {
    setPecas(prev => [...prev, { ...peca, id: generateId() }]);
  };

  const updatePeca = (id: string, peca: Partial<Peca>) => {
    setPecas(prev => prev.map(item => item.id === id ? { ...item, ...peca } : item));
  };

  const addCompra = (compra: Omit<Compra, 'id'>) => {
    const novaCompra = { ...compra, id: generateId() };
    setCompras(prev => [...prev, novaCompra]);
    
    // Atualizar estoque da peça
    setPecas(prev => prev.map(peca => 
      peca.id === compra.peca_id 
        ? { ...peca, quantidade_disponivel: peca.quantidade_disponivel + compra.quantidade_comprada }
        : peca
    ));
  };

  const getDashboardStats = (): DashboardStats => {
    const total_atendimentos = atendimentos.length;
    const atendimentos_pendentes = atendimentos.filter(a => a.status === 'pendente').length;
    const equipamentos_manutencao = equipamentos.filter(e => e.status === 'manutencao').length;
    const pecas_estoque_baixo = pecas.filter(p => p.quantidade_disponivel <= p.quantidade_minima).length;
    
    const atendimentos_por_status = atendimentos.reduce((acc, atendimento) => {
      acc[atendimento.status] = (acc[atendimento.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const ultimos_atendimentos = atendimentos
      .sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime())
      .slice(0, 5);

    return {
      total_atendimentos,
      atendimentos_pendentes,
      equipamentos_manutencao,
      pecas_estoque_baixo,
      atendimentos_por_status,
      ultimos_atendimentos
    };
  };

  return (
    <AppContext.Provider value={{
      atendimentos,
      equipamentos,
      manutencoes,
      pecas,
      compras,
      addAtendimento,
      updateAtendimento,
      deleteAtendimento,
      addEquipamento,
      updateEquipamento,
      deleteEquipamento,
      addManutencao,
      addPeca,
      updatePeca,
      addCompra,
      getDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};