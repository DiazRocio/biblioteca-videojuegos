import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faGamepad } from '@fortawesome/free-solid-svg-icons';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'No se pudo completar la solicitud.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', String(data.user.id));
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      navigate('/catalog');
    } catch (requestError) {
      console.error('Error de autenticación:', requestError);
      setError('No se pudo conectar con el backend. Comprueba que esté iniciado.');
    } finally {
      setIsSubmitting(false);
    }
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

              {error && <div className="alert alert-danger auth-feedback" role="alert">{error}</div>}

              <button type="submit" className="btn btn-cyber-primary w-100 py-2 mb-3" disabled={isSubmitting}>
                {isSubmitting ? 'PROCESANDO...' : isRegister ? 'CREAR CUENTA' : 'INGRESAR'}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
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