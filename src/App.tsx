import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Atendimentos from './pages/Atendimentos';
import Equipamentos from './pages/Equipamentos';
import Estoque from './pages/Estoque';
import Compras from './pages/Compras';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'atendimentos':
        return <Atendimentos />;
      case 'equipamentos':
        return <Equipamentos />;
      case 'estoque':
        return <Estoque />;
      case 'compras':
        return <Compras />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;