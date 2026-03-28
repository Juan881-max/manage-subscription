import { useMemo } from 'react';
import { AlertCircle, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { differenceInDays, parseISO, isPast, addMonths, addYears } from 'date-fns';

export default function AlertsPanel({ subscriptions }) {
  const alerts = useMemo(() => {
    const alertsList = [];
    const today = new Date();

    // 1. Próximos cobros (7 días)
    subscriptions.forEach(sub => {
      if (sub.billingDate) {
        let billingDate = parseISO(sub.billingDate);
        
        // Si la fecha ya pasó, calculamos el próximo cobro (simulación simple)
        if (isPast(billingDate)) {
           if (sub.frequency === 'monthly') {
             billingDate = addMonths(billingDate, 1);
           } else {
             billingDate = addYears(billingDate, 1);
           }
        }

        const diff = differenceInDays(billingDate, today);
        if (diff >= 0 && diff <= 7) {
          alertsList.push({
            id: `upcoming-${sub.id}`,
            type: 'upcoming',
            title: `Cobro próximo de ${sub.name}`,
            message: `El cobro de ${sub.price}€ se realizará en ${diff === 0 ? 'hoy' : diff + ' días'}.`,
            icon: <Calendar size={20} color="var(--accent-blue)" />,
            color: 'var(--accent-blue)',
            bg: 'rgba(76, 201, 240, 0.1)'
          });
        }
      }
    });

    // 2. Duplicados
    const names = {};
    subscriptions.forEach(sub => {
      const lower = sub.name.toLowerCase().trim();
      if (!names[lower]) names[lower] = [];
      names[lower].push(sub);
    });

    Object.keys(names).forEach(name => {
      if (names[name].length > 1) {
        alertsList.push({
          id: `duplicate-${name}`,
          type: 'duplicate',
          title: 'Posibles suscripciones duplicadas',
          message: `Tienes ${names[name].length} suscripciones llamadas "${names[name][0].name}". Revisa si hay pagos repetidos.`,
          icon: <RefreshCw size={20} color="var(--accent-purple)" />,
          color: 'var(--accent-purple)',
          bg: 'rgba(157, 78, 221, 0.1)'
        });
      }
    });

    // 3. Subidas de precio
    subscriptions.forEach(sub => {
      if (sub.priceHistory && sub.priceHistory.length > 0) {
        const lastPrice = sub.priceHistory[0]; // Guardamos el primer precio conocido
        if (sub.price > lastPrice) {
          alertsList.push({
            id: `hike-${sub.id}`,
            type: 'price-hike',
            title: `Subida de precio en ${sub.name}`,
            message: `El precio ha subido: antes pagabas ${lastPrice}€, ahora ${sub.price}€.`,
            icon: <AlertTriangle size={20} color="var(--accent-orange)" />,
            color: 'var(--accent-orange)',
            bg: 'rgba(255, 107, 53, 0.1)'
          });
        }
      }
    });

    return alertsList;
  }, [subscriptions]);

  if (alerts.length === 0) return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h2 className="title-md flex items-center gap-2">
        <AlertCircle size={20} />
        Alertas y Notificaciones
      </h2>
      <div className="flex items-center justify-center text-muted h-24">
        Todo en orden. No tienes notificaciones pendientes.
      </div>
    </div>
  );

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h2 className="title-md flex items-center gap-2">
        <AlertCircle size={20} />
        Alertas y Notificaciones
      </h2>
      <div className="flex flex-col gap-4">
        {alerts.map(alert => (
          <div key={alert.id} className="glass-panel-sm flex items-start gap-4" style={{ backgroundColor: alert.bg, borderLeft: `4px solid ${alert.color}` }}>
            <div style={{ padding: '2px 0' }}>{alert.icon}</div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{alert.title}</div>
              <div className="text-muted">{alert.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
