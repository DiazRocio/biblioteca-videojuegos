import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faSearch, faBookmark, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            {token && (
              <li className="nav-item">
                <Link className="nav-link font-cyber" to="/library">
                  <FontAwesomeIcon icon={faBookmark} className="me-2 text-magenta" />
                  Mi Biblioteca
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {token ? (
              <button onClick={handleLogout} className="btn btn-cyber-magenta btn-sm">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Salir
              </button>
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