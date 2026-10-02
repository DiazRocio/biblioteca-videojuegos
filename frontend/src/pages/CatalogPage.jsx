import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [addingGameId, setAddingGameId] = useState(null);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const addToLibrary = async (game) => {
    setFeedback('');
    if (!userId || !token) {
      setFeedback('Inicia sesión para guardar juegos en tu biblioteca.');
      return;
    }

    try {
      setAddingGameId(game.id);
      const response = await fetch('http://localhost:3000/api/library/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: game.id,
          game: { id: game.id, name: game.name, genre: game.genre, image: game.image }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data.message || 'No se pudo guardar el juego.');
        return;
      }

      setFeedback(data.message || 'Juego guardado en tu biblioteca.');
    } catch (error) {
      console.error('Error al guardar juego:', error);
      setFeedback('No se pudo conectar con el backend para guardar el juego.');
    } finally {
      setAddingGameId(null);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const query = searchTerm.trim();
        const url = new URL('http://localhost:3000/api/games');
        if (query) url.searchParams.set('search', query);

        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'No se pudo cargar el catálogo.');
        setGames(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al cargar juegos:', error);
          setError(error.message || 'No se pudo cargar el catálogo.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, searchTerm ? 350 : 0);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="font-cyber text-cyan mb-1">Catálogo Global</h2>
          <p className="text-muted small">Explora y añade juegos a tu colección personal</p>
          <p className="text-muted small mb-0">
            Datos proporcionados por <a href="https://www.igdb.com/" target="_blank" rel="noreferrer">IGDB</a>.
          </p>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {feedback && <div className="alert alert-info" role="status">{feedback}</div>}

      {loading ? (
        <div className="text-center text-muted py-5">Cargando juegos...</div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : games.length === 0 ? (
        <div className="cyber-card p-4 text-center text-muted">
          {searchTerm ? 'No se encontraron juegos con esa búsqueda.' : 'Todavía no hay juegos en el catálogo.'}
        </div>
      ) : (
        <div className="row g-4">
          {games.map(game => (
            <div key={game.id} className="col-md-4">
              <div className="cyber-card h-100">
                <img src={game.image} className="card-img-top card-game-img" alt={game.name} />
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title font-cyber text-white mb-0">{game.name}</h5>
                    <span className="badge badge-cyber">{game.genre}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
                    <span className="small text-muted">{game.rating ? `${game.rating} / 5.0` : 'Sin puntuación'}</span>
                  </div>
                  <button className="btn btn-cyber-green w-100" onClick={() => addToLibrary(game)} disabled={addingGameId === game.id}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    {addingGameId === game.id ? 'Guardando...' : 'Añadir a Mi Biblioteca'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}