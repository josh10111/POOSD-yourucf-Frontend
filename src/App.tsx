import './App.css';
import LoginPage from './pages/LoginPage.tsx';
import Dashboard from './pages/DashPage.tsx';
import VerifyPage from './pages/VerifyPage.tsx';
import PassLinkPage from './pages/PassLinkPage.tsx';
import PassResetPage from './pages/PassResetPage.tsx';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

function App() 
{
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resetlink" element={<PassLinkPage />} />
        <Route path="/resetpassword" element={<PassResetPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;

