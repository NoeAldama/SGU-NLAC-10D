import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Configuración robusta de URL (compatible con vista previa y Docker)
  const getEnv = (key, fallback) => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback;
    }
    return fallback;
  };

  const HOST = getEnv('VITE_API_HOST', 'localhost');
  const PORT = getEnv('VITE_API_PORT', '8081');
  const BASE = getEnv('VITE_API_BASE', '/sgu-api');
  const API_URL = `http://${HOST}:${PORT}${BASE}/users`;

  // Estados
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Lógica de Negocio ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('No se pudo conectar al servidor');
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar');
      
      resetForm();
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email, phoneNumber: user.phoneNumber });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phoneNumber: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Renderizado ---
  return (
    <div className="app-wrapper">
      {/* Barra de Navegación Superior */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">SGU</div>
          <h1>Sistema de Gestión de Usuarios</h1>
        </div>
      </nav>

      <div className="main-container">
        {error && (
          <div className="alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="layout-grid">
          {/* PANEL IZQUIERDO: Formulario */}
          <aside className="panel form-panel">
            <div className="panel-header">
              <h2>{editingId ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="phoneNumber">Teléfono</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="button-group">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Actualizar Datos' : 'Guardar Usuario'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </aside>

          {/* PANEL DERECHO: Tabla de Datos */}
          <section className="panel table-panel">
            <div className="panel-header">
              <h2>📋 Directorio de Usuarios</h2>
              <span className="badge">{users.length} registros</span>
            </div>
            <div className="panel-body table-responsive">
              {loading ? (
                <div className="loading-state">Cargando datos...</div>
              ) : users.length === 0 ? (
                <div className="empty-state">No hay usuarios registrados aún.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Contacto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-id">ID: {user.id}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div>📧 {user.email}</div>
                            <div>📱 {user.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="actions-cell">
                          <button 
                            className="icon-btn edit-btn" 
                            onClick={() => handleEdit(user)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            className="icon-btn delete-btn" 
                            onClick={() => handleDelete(user.id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;