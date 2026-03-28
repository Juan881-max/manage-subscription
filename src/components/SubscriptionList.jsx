import { Edit2, Trash2, Music, Film, ShoppingBag, Terminal, Globe, Zap, CreditCard } from 'lucide-react';

const categoryIcons = {
  'musica': Music,
  'music': Music,
  'entretenimiento': Film,
  'entertainment': Film,
  'netflix': Film,
  'compras': ShoppingBag,
  'shopping': ShoppingBag,
  'software': Terminal,
  'saas': Terminal,
  'web': Globe,
  'utilidades': Zap,
  'utilities': Zap,
  'finanzas': CreditCard,
  'finance': CreditCard,
};

const getCategoryIcon = (category) => {
  const norm = category.toLowerCase().trim();
  return categoryIcons[norm] || Zap;
};

export default function SubscriptionList({ subscriptions, onEdit, onDelete }) {
  if (subscriptions.length === 0) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h2 className="title-md">Gestión de Membresías</h2>
      <div className="flex-col gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
        {subscriptions.map(sub => (
          <div 
            key={sub.id} 
            className="glass-panel-sm flex justify-between items-center list-item-hover" 
            style={{ borderLeft: '4px solid var(--accent-blue)' }}
          >
            <div className="flex gap-4 items-center" style={{ flex: 1, minWidth: 0 }}>
              <div className="category-icon-bg">
                {(() => {
                  const Icon = getCategoryIcon(sub.category);
                  return <Icon size={18} />;
                })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.name}</div>
                <div className="text-muted flex gap-2 items-center" style={{ marginTop: '2px' }}>
                   <span>{sub.price.toFixed(2)}€ /{sub.frequency === 'monthly' ? ' mes' : ' año'}</span>
                </div>
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
