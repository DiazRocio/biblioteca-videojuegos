import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faGamepad } from '@fortawesome/free-solid-svg-icons';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isRegister ? 'Registrando:' : 'Iniciando sesión:', formData);
    // Próximamente: conexión con el Backend
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="cyber-card p-4">
            <div className="text-center mb-4">
              <FontAwesomeIcon icon={faGamepad} className="fs-1 text-cyan mb-2" />
              <h2 className="font-cyber">{isRegister ? 'Registro' : 'Iniciar Sesión'}</h2>
              <p className="text-muted small">Accede a tu bóveda personal de videojuegos</p>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className="mb-3">
                  <label className="cyber-label">Nombre de usuario</label>
                  <div className="input-group">
                    <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="GamerTag"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="cyber-label">Correo Electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="usuario@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="cyber-label">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-cyber-primary w-100 py-2 mb-3">
                {isRegister ? 'CREAR CUENTA' : 'INGRESAR'}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="btn btn-link text-cyan text-decoration-none small"
              >
                {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}