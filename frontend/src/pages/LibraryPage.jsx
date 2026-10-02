import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faCheck, faHourglassHalf, faStar } from '@fortawesome/free-solid-svg-icons';

export default function LibraryPage() {
  const [tab, setTab] = useState('pendiente');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!userId || !token) {
        setError('Inicia sesión para consultar tu biblioteca.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/library/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'No se pudo cargar la biblioteca.');
        setGames(data);
      } catch (error) {
        console.error('Error al cargar la biblioteca:', error);
        setError(error.message || 'No se pudo cargar la biblioteca.');
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [userId, token]);

  const statusMap = {
    jugando: 'En progreso',
    completado: 'Finalizado',
    pendiente: 'Planeado para jugar'
  };

  const filteredGames = games.filter((game) => game.estado === statusMap[tab]);

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

      {loading ? (
        <div className="cyber-card p-4 text-center text-muted">Cargando biblioteca...</div>
      ) : error ? (
        <div className="cyber-card p-4 text-center">
          <p className="text-muted mb-3">{error}</p>
          {!token && <Link to="/login" className="btn btn-cyber-primary">Ingresar</Link>}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="cyber-card p-4 text-center">
          <p className="text-muted mb-3">No tienes videojuegos clasificados en esta sección todavía.</p>
          <Link to="/catalog" className="btn btn-cyber-primary">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="col-md-4">
              <div className="cyber-card h-100">
                <img src={game.imagen} className="card-img-top card-game-img" alt={game.nombre} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title font-cyber text-white mb-0">{game.nombre}</h5>
                    <span className="badge badge-cyber">{game.genero}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
                    <span className="small text-muted">{game.horasJugadas} horas</span>
                  </div>
                  <div className="small text-muted">Estado: {game.estado}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}