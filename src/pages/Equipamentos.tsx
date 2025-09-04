import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Plus, Edit2, Trash2, Search, History, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const Equipamentos: React.FC = () => {
  const { equipamentos, manutencoes, addEquipamento, updateEquipamento, deleteEquipamento, addManutencao } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<string | null>(null);
  const [selectedEquipamento, setSelectedEquipamento] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    status: 'ativo' as const,
    data_aquisicao: '',
    localizacao: ''
  });

  const [maintenanceData, setMaintenanceData] = useState({
    tipo: 'preventiva' as const,
    descricao: '',
    data: '',
    tecnico: '',
    custo: ''
  });

  const filteredEquipamentos = equipamentos.filter(equipamento =>
    equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipamento.numero_serie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEquipamentoManutencoes = (equipamentoId: string) => {
    return manutencoes.filter(m => m.equipamento_id === equipamentoId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEquipamento) {
      updateEquipamento(editingEquipamento, formData);
    } else {
      addEquipamento(formData);
    }

    setIsModalOpen(false);
    setEditingEquipamento(null);
    resetForm();
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEquipamento) {
      addManutencao({
        ...maintenanceData,
        equipamento_id: selectedEquipamento,
        custo: maintenanceData.custo ? parseFloat(maintenanceData.custo) : undefined
      });
    }

    setIsMaintenanceModalOpen(false);
    setSelectedEquipamento(null);
    setMaintenanceData({
      tipo: 'preventiva',
      descricao: '',
      data: '',
      tecnico: '',
      custo: ''
    });
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      status: 'ativo',
      data_aquisicao: '',
      localizacao: ''
    });
  };

  const handleEdit = (equipamento: any) => {
    setFormData({
      nome: equipamento.nome,
      marca: equipamento.marca,
      modelo: equipamento.modelo,
      numero_serie: equipamento.numero_serie,
      status: equipamento.status,
      data_aquisicao: equipamento.data_aquisicao,
      localizacao: equipamento.localizacao
    });
    setEditingEquipamento(equipamento.id);
    setIsModalOpen(true);
  };

  const handleViewHistory = (equipamento: any) => {
    setSelectedEquipamento(equipamento.id);
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Equipamentos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Equipamento
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, marca, modelo ou número de série..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Equipamentos Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Série</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipamentos.map((equipamento) => (
                <tr key={equipamento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {equipamento.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {equipamento.marca}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {equipamento.modelo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {equipamento.numero_serie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={equipamento.status} type="equipamento" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {equipamento.localizacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewHistory(equipamento)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Ver Histórico"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEquipamento(equipamento.id);
                          setIsMaintenanceModalOpen(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                        title="Nova Manutenção"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(equipamento)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteEquipamento(equipamento.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipamento Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEquipamento(null);
          resetForm();
        }}
        title={editingEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                required
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                required
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Série</label>
              <input
                type="text"
                required
                value={formData.numero_serie}
                onChange={(e) => setFormData({ ...formData, numero_serie: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ativo">Ativo</option>
                <option value="manutencao">Manutenção</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Aquisição</label>
              <input
                type="date"
                required
                value={formData.data_aquisicao}
                onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
              <input
                type="text"
                required
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingEquipamento(null);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingEquipamento ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Maintenance Modal */}
      <Modal
        isOpen={isMaintenanceModalOpen}
        onClose={() => {
          setIsMaintenanceModalOpen(false);
          setSelectedEquipamento(null);
          setMaintenanceData({
            tipo: 'preventiva',
            descricao: '',
            data: '',
            tecnico: '',
            custo: ''
          });
        }}
        title="Nova Manutenção"
      >
        <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Manutenção</label>
            <select
              required
              value={maintenanceData.tipo}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, tipo: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
              <option value="preditiva">Preditiva</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              required
              value={maintenanceData.descricao}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, descricao: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={maintenanceData.data}
                onChange={(e) => setMaintenanceData({ ...maintenanceData, data: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={maintenanceData.custo}
                onChange={(e) => setMaintenanceData({ ...maintenanceData, custo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
            <input
              type="text"
              required
              value={maintenanceData.tecnico}
              onChange={(e) => setMaintenanceData({ ...maintenanceData, tecnico: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsMaintenanceModalOpen(false);
                setSelectedEquipamento(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Registrar Manutenção
            </button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedEquipamento(null);
        }}
        title={`Histórico de Manutenção - ${selectedEquipamento ? equipamentos.find(e => e.id === selectedEquipamento)?.nome : ''}`}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedEquipamento && getEquipamentoManutencoes(selectedEquipamento).length > 0 ? (
            getEquipamentoManutencoes(selectedEquipamento).map((manutencao) => (
              <div key={manutencao.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        manutencao.tipo === 'preventiva' ? 'bg-blue-100 text-blue-800' :
                        manutencao.tipo === 'corretiva' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {manutencao.tipo.charAt(0).toUpperCase() + manutencao.tipo.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(manutencao.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mb-2">{manutencao.descricao}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="flex items-center">
                        <span className="font-medium">Técnico:</span>
                        <span className="ml-1">{manutencao.tecnico}</span>
                      </span>
                      {manutencao.custo && (
                        <span className="flex items-center">
                          <span className="font-medium">Custo:</span>
                          <span className="ml-1 text-green-600 font-medium">R$ {manutencao.custo.toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma manutenção registrada para este equipamento</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Equipamentos;