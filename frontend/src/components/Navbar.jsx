import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faSearch, faBookmark, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const readSession = () => {
  const token = localStorage.getItem('token');

  try {
    return { token, user: JSON.parse(localStorage.getItem('user') || 'null') };
  } catch {
    return { token, user: null };
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const updateSession = () => setSession(readSession());
    window.addEventListener('storage', updateSession);
    window.addEventListener('auth-change', updateSession);

    return () => {
      window.removeEventListener('storage', updateSession);
      window.removeEventListener('auth-change', updateSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark unahur-header sticky-top mb-4">
      <div className="container">
        <Link className="navbar-brand unahur-brand d-flex align-items-center gap-2" to="/">
          <FontAwesomeIcon icon={faGamepad} className="text-cyan fs-3" />
          <span>CYBER<small>VAULT</small></span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link font-cyber" to="/catalog">
                <FontAwesomeIcon icon={faSearch} className="me-2 text-cyan" />
                Catálogo
              </Link>
            </li>
            {session.token && (
              <li className="nav-item">
                <Link className="nav-link font-cyber" to="/library">
                  <FontAwesomeIcon icon={faBookmark} className="me-2 text-magenta" />
                  Mi Biblioteca
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {session.token ? (
              <>
                <span className="navbar-user d-none d-sm-inline-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-cyan" />
                  {session.user?.username || session.user?.email || 'Jugador'}
                </span>
                <button onClick={handleLogout} className="btn btn-cyber-magenta btn-sm">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-cyber-primary btn-sm">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Ingresar / Registro
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}