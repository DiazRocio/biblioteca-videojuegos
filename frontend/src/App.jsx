import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import LibraryPage from './pages/LibraryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}