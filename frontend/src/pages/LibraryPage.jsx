import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faCheck, faHourglassHalf, faStar } from '@fortawesome/free-solid-svg-icons';

export default function LibraryPage() {
  const [tab, setTab] = useState('jugando');

  return (
    <div className="container py-4">
      <h2 className="font-cyber text-cyan mb-3">Mi Biblioteca</h2>

      <ul className="nav nav-tabs nav-tabs-cyber mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${tab === 'jugando' ? 'active' : ''}`}
            onClick={() => setTab('jugando')}
          >
            <FontAwesomeIcon icon={faGamepad} className="me-2" />
            Jugando
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${tab === 'completado' ? 'active' : ''}`}
            onClick={() => setTab('completado')}
          >
            <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
            Completados
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${tab === 'pendiente' ? 'active' : ''}`}
            onClick={() => setTab('pendiente')}
          >
            <FontAwesomeIcon icon={faHourglassHalf} className="me-2 text-warning" />
            Pendientes
          </button>
        </li>
      </ul>

      <div className="cyber-card p-4 text-center">
        <p className="text-muted mb-0">No tienes videojuegos clasificados en esta sección todavía.</p>
      </div>
    </div>
  );
}