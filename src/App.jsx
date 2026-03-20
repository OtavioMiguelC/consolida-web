import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; 
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Páginas do Sistema (Apenas as que você manteve)
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import TeamManagement from './pages/TeamManagement';
import IBGE from './pages/IBGE';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Privadas (Protegidas) */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              {/* O Workspace agora é a tela inicial "/" */}
              <Route index element={<Workspace />} />
              <Route path="ibge" element={<IBGE />} />
              
              {/* Rota restrita apenas para Administradores */}
              <Route path="team" element={<PrivateRoute requireAdmin={true}><TeamManagement /></PrivateRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
