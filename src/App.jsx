import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SubscriptionForm from './components/SubscriptionForm';
import AlertsPanel from './components/AlertsPanel';
import SubscriptionList from './components/SubscriptionList';
import Toast from './components/Toast';

export default function App() {
  const [subscriptions, setSubscriptions] = useState(() => {
    // Inicializar estado desde LocalStorage si existe
    const data = localStorage.getItem('subscriptions_data');
    return data ? JSON.parse(data) : [];
  });
  
  const [editingSub, setEditingSub] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Guardar en LocalStorage cada vez que cambien las suscripciones
  useEffect(() => {
    localStorage.setItem('subscriptions_data', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const handleSave = (sub) => {
    if (editingSub) {
      // Si estamos editando y hubo cambio de precio, registrar histórico
      setSubscriptions(subs => subs.map(s => {
        if (s.id === sub.id) {
          const newData = { ...sub };
          // Chequear subida de precio
          if (s.price !== sub.price) {
             const h = s.priceHistory || [];
             newData.priceHistory = [...h, s.price]; // Guardamos el precio antiguo
          } else {
             newData.priceHistory = s.priceHistory || [];
          }
          return newData;
        }
        return s;
      }));
      setEditingSub(null);
      showNotification('Suscripción actualizada correctamente');
    } else {
      // Nueva suscripción
      setSubscriptions(subs => [...subs, { ...sub, priceHistory: [] }]);
      showNotification('Suscripción añadida correctamente');
    }
    // Cerrar sidebar en móvil al guardar
    setIsSidebarOpen(false);
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta suscripción?')) {
      setSubscriptions(subs => subs.filter(s => s.id !== id));
      if (editingSub?.id === id) setEditingSub(null);
      showNotification('Suscripción eliminada', 'info');
    }
  };

  return (
    <div className={`app-container animate-fade-in ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Botón menú móvil */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger"></span>
      </button>

      {/* Barra lateral / Columna izquierda: Agregar/Editar y Lista */}
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
           <h1 className="title" style={{ 
               color: 'var(--accent-orange)', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '8px',
               fontSize: '1.2rem',
               letterSpacing: '0.5px'
             }}>
             Mis Suscripciones
           </h1>
           <div className="text-muted" style={{ marginBottom: '32px', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
             Control inteligente de gastos recurrentes.
           </div>
        </div>
        
        <SubscriptionForm 
          onSave={handleSave} 
          onCancel={() => setEditingSub(null)} 
          editingSub={editingSub} 
        />
        
        <SubscriptionList 
          subscriptions={subscriptions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </aside>

      {/* Contenido Principal / Columna derecha: Dashboard y Alertas */}
      <div className="main-content">
        <header style={{ marginBottom: '32px' }}>
          <h2 className="title-lg" style={{ letterSpacing: '1px', fontWeight: 700 }}>Dashboard Financiero</h2>
        </header>

        <Dashboard subscriptions={subscriptions} />
        <AlertsPanel subscriptions={subscriptions} />
      </div>

      <Toast notification={notification} />
    </div>
  );
}
