import { Edit2, Trash2 } from 'lucide-react';

export default function SubscriptionList({ subscriptions, onEdit, onDelete }) {
  if (subscriptions.length === 0) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h2 className="title-md">Tus Suscripciones</h2>
      <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
        {subscriptions.map(sub => (
          <div 
            key={sub.id} 
            className="glass-panel-sm flex justify-between items-center" 
            style={{ borderLeft: '4px solid var(--accent-blue)' }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.name}</div>
              <div className="text-muted flex gap-2 items-center" style={{ marginTop: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple" style={{ whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.category}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{sub.price.toFixed(2)}€ /{sub.frequency === 'monthly' ? ' Mes' : ' Año'}</span>
              </div>
            </div>
            <div className="flex gap-2" style={{ flexShrink: 0 }}>
              <button 
                onClick={() => onEdit(sub)} 
                className="btn btn-secondary btn-icon-only" 
                title="Editar"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(sub.id)} 
                className="btn btn-danger btn-icon-only" 
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
