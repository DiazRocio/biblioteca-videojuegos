import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de prueba temporales
  const mockGames = [
    { id: 1, name: 'Cyberpunk 2077', genre: 'RPG', rating: 4.5, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500' },
    { id: 2, name: 'The Witcher 3', genre: 'Action RPG', rating: 4.9, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
    { id: 3, name: 'Elden Ring', genre: 'Soulslike', rating: 4.8, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500' }
  ];

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="font-cyber text-cyan mb-1">Catálogo Global</h2>
          <p className="text-muted small">Explora y añade juegos a tu colección personal</p>
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

      <div className="row g-4">
        {mockGames.map(game => (
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
                  <span className="small text-muted">{game.rating} / 5.0</span>
                </div>
                <button className="btn btn-cyber-green w-100">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Añadir a Mi Biblioteca
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}