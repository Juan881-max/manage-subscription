import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SubscriptionForm({ onSave, onCancel, editingSub }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'monthly',
    category: '',
    billingDate: ''
  });

  useEffect(() => {
    if (editingSub) {
      setFormData({
        ...editingSub,
        price: editingSub.price.toString(),
        billingDate: editingSub.billingDate.split('T')[0] // Formato YYYY-MM-DD para input[type="date"]
      });
    }
  }, [editingSub]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica de fecha
    if (!formData.billingDate) {
      alert('Por favor, selecciona una fecha de cobro.');
      return;
    }

    try {
      const sub = {
        id: editingSub ? editingSub.id : uuidv4(),
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        frequency: formData.frequency,
        category: formData.category.trim() || 'Otros',
        billingDate: new Date(formData.billingDate).toISOString().split('T')[0]
      };
      
      onSave(sub);
      
      if (!editingSub) {
        setFormData({ name: '', price: '', frequency: 'monthly', category: '', billingDate: '' });
      }
    } catch (err) {
      console.error('Error saving subscription:', err);
      alert('Error al guardar la suscripción. Revisa los datos.');
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="title-md">{editingSub ? 'Editar Suscripción' : 'Nueva Suscripción'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
            placeholder="Ej. Netflix" 
          />
        </div>
        <div className="flex gap-4">
          <div className="form-group w-full">
            <label className="form-label">Precio (€)</label>
            <input 
              type="number" 
              step="0.01" 
              className="form-control" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
              required 
              placeholder="0.00" 
            />
          </div>
          <div className="form-group w-full">
            <label className="form-label">Frecuencia</label>
            <select 
              className="form-control" 
              value={formData.frequency} 
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
            >
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <input 
            type="text" 
            className="form-control" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
            placeholder="Ej. Entretenimiento, Software..." 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Próximo cobro</label>
          <input 
            type="date" 
            className="form-control" 
            value={formData.billingDate} 
            onChange={(e) => setFormData({...formData, billingDate: e.target.value})} 
            required 
          />
        </div>
        <div className="flex gap-4" style={{ marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary w-full">
            {editingSub ? 'Guardar Cambios' : 'Añadir Suscripción'}
          </button>
          {editingSub && (
            <button type="button" className="btn btn-secondary w-full" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
