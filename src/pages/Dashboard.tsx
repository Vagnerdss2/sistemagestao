import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../contexts/AppContext';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Package, Wrench } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const Dashboard: React.FC = () => {
  const { getDashboardStats } = useAppContext();
  const stats = getDashboardStats();
  const { atendimentos } = useAppContext();

  // Preparar dados para o gráfico de tipos de atendimento
  const tiposAtendimento = atendimentos.reduce((acc, atendimento) => {
    const tipo = atendimento.tipo_servico;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(tiposAtendimento).map(([tipo, quantidade]) => ({
    tipo: tipo.length > 15 ? tipo.substring(0, 15) + '...' : tipo,
    quantidade,
    fullTipo: tipo
  }));
  const { atendimentos } = useAppContext();

  // Preparar dados para o gráfico de tipos de atendimento
  const tiposAtendimento = atendimentos.reduce((acc, atendimento) => {
    const tipo = atendimento.tipo_servico;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(tiposAtendimento).map(([tipo, quantidade]) => ({
    tipo: tipo.length > 15 ? tipo.substring(0, 15) + '...' : tipo,
    quantidade,
    fullTipo: tipo
  }));

  const statusColors = {
    pendente: 'bg-yellow-500',
    em_andamento: 'bg-blue-500', 
    concluido: 'bg-green-500',
    cancelado: 'bg-red-500'
  };

  const statCards = [
    {
      title: 'Total de Atendimentos',
      value: stats.total_atendimentos,
      icon: TrendingUp,
      color: 'bg-blue-600'
    },
    {
      title: 'Atendimentos Pendentes',
      value: stats.atendimentos_pendentes,
      icon: Clock,
      color: 'bg-yellow-600'
    },
    {
      title: 'Equipamentos em Manutenção',
      value: stats.equipamentos_manutencao,
      icon: Wrench,
      color: 'bg-orange-600'
    },
    {
      title: 'Peças com Estoque Baixo',
      value: stats.pecas_estoque_baixo,
      icon: AlertTriangle,
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Atendimentos por Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atendimentos por Status</h2>
          <div className="space-y-3">
            {Object.entries(stats.atendimentos_por_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                  <StatusBadge status={status} />
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Atendimentos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Atendimentos</h2>
          <div className="space-y-3">
            {stats.ultimos_atendimentos.length > 0 ? (
              stats.ultimos_atendimentos.map((atendimento) => (
                <div key={atendimento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{atendimento.cliente}</p>
                    <p className="text-sm text-gray-600">{atendimento.equipamento}</p>
                    <p className="text-xs text-gray-500">{new Date(atendimento.data_inicio).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={atendimento.status} />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum atendimento registrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de Tipos de Atendimento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Tipos de Atendimento Mais Utilizados</h2>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="tipo" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name, props) => [value, 'Quantidade']}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.fullTipo || label;
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  stroke="#2563eb"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <p>Nenhum dado disponível para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico de Tipos de Atendimento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Tipos de Atendimento Mais Utilizados</h2>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="tipo" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name, props) => [value, 'Quantidade']}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.fullTipo || label;
                  }}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="quantidade" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  stroke="#2563eb"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <p>Nenhum dado disponível para exibir</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;