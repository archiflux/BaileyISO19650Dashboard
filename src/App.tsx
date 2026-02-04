import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BepProvider } from './context/BepContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProjectSelector from './pages/ProjectSelector';
import BepGenerator from './pages/BepGenerator';

function App() {
  return (
    <BepProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectSelector />} />
            <Route path="/bep" element={<BepGenerator />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BepProvider>
  );
}

export default App;
