import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SubscriptionForm from './components/SubscriptionForm';
import AlertsPanel from './components/AlertsPanel';
import SubscriptionList from './components/SubscriptionList';

export default function App() {
  const [subscriptions, setSubscriptions] = useState(() => {
    // Inicializar estado desde LocalStorage si existe
    const data = localStorage.getItem('subscriptions_data');
    return data ? JSON.parse(data) : [];
  });
  
  const [editingSub, setEditingSub] = useState(null);

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
    } else {
      // Nueva suscripción
      setSubscriptions(subs => [...subs, { ...sub, priceHistory: [] }]);
    }
  };

  const handleEdit = (sub) => {
    setEditingSub(sub);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta suscripción?')) {
      setSubscriptions(subs => subs.filter(s => s.id !== id));
      if (editingSub?.id === id) setEditingSub(null);
    }
  };

  return (
    <div className="app-container animate-fade-in">
      {/* Barra lateral / Columna izquierda: Agregar/Editar y Lista */}
      <div className="sidebar">
        <h1 className="title" style={{ 
            color: 'var(--text-main)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
          <span style={{ 
            background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-purple))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Suscrip</span>ciónes
        </h1>
        <div className="text-muted" style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
          Gestión inteligente de suscripciones y ahorro.
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
      </div>

      {/* Contenido Principal / Columna derecha: Dashboard y Alertas */}
      <div className="main-content">
        <header style={{ marginBottom: '32px' }}>
          <h2 className="title-lg">Dashboard Financiero</h2>
        </header>

        <Dashboard subscriptions={subscriptions} />
        <AlertsPanel subscriptions={subscriptions} />
      </div>
    </div>
  );
}
