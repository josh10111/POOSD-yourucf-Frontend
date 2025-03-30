import './App.css';
import LoginPage from './pages/LoginPage.tsx';
import VerifyPage from './pages/VerifyPage.tsx';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;