import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'atendimento' | 'equipamento';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'atendimento' }) => {
  const getStatusConfig = () => {
    if (type === 'atendimento') {
      switch (status) {
        case 'pendente':
          return { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' };
        case 'em_andamento':
          return { color: 'bg-blue-100 text-blue-800', text: 'Em Andamento' };
        case 'concluido':
          return { color: 'bg-green-100 text-green-800', text: 'Concluído' };
        case 'cancelado':
          return { color: 'bg-red-100 text-red-800', text: 'Cancelado' };
        default:
          return { color: 'bg-gray-100 text-gray-800', text: status };
      }
    } else {
      switch (status) {
        case 'ativo':
          return { color: 'bg-green-100 text-green-800', text: 'Ativo' };
        case 'manutencao':
          return { color: 'bg-yellow-100 text-yellow-800', text: 'Manutenção' };
        case 'inativo':
          return { color: 'bg-red-100 text-red-800', text: 'Inativo' };
        default:
          return { color: 'bg-gray-100 text-gray-800', text: status };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;