import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard({ subscriptions }) {
  const { totalMonthly, totalYearly, topExpenses, categoryData } = useMemo(() => {
    let monthly = 0;
    let yearly = 0;
    const catMap = {};

    subscriptions.forEach(sub => {
      const isMonthly = sub.frequency === 'monthly';
      const monthlyCost = isMonthly ? sub.price : sub.price / 12;
      const yearlyCost = isMonthly ? sub.price * 12 : sub.price;

      monthly += monthlyCost;
      yearly += yearlyCost;

      if (!catMap[sub.category]) {
        catMap[sub.category] = 0;
      }
      catMap[sub.category] += monthlyCost; // Usar coste mensual para el gráfico
    });

    const categories = Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key]
    })).sort((a, b) => b.value - a.value);

    // Top 3 gastos (calculados por costo mensual)
    const top = [...subscriptions]
      .sort((a, b) => {
        const valA = a.frequency === 'monthly' ? a.price : a.price / 12;
        const valB = b.frequency === 'monthly' ? b.price : b.price / 12;
        return valB - valA;
      })
      .slice(0, 3);

    return {
      totalMonthly: monthly,
      totalYearly: yearly,
      topExpenses: top,
      categoryData: categories
    };
  }, [subscriptions]);

  const COLORS = ['#9d4edd', '#ff6b35', '#4cc9f0', '#2dc653', '#ef233c', '#ffb703', '#f15bb5', '#00bbf9'];

  return (
    <div className="flex-col gap-6 w-full">
      <div className="stats-grid">
        <div className="glass-panel">
          <div className="text-muted mb-2">Total Mensual</div>
          <div className="title" style={{ fontSize: '2.5rem', color: 'var(--accent-blue)' }}>
            {totalMonthly.toFixed(2)}€
          </div>
        </div>
        <div className="glass-panel">
          <div className="text-muted mb-2">Total Anual</div>
          <div className="title" style={{ fontSize: '2.5rem', color: 'var(--accent-purple)' }}>
            {totalYearly.toFixed(2)}€
          </div>
        </div>
        <div className="glass-panel">
          <div className="text-muted mb-2">Suscripciones Activas</div>
          <div className="title" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>
            {subscriptions.length}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 0 }}>
        <div className="glass-panel">
          <h2 className="title-md">Distribución del Capital</h2>
          {categoryData.length > 0 ? (
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value.toFixed(2)}€ / mes`} 
                    contentStyle={{ backgroundColor: 'var(--panel-light)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-col items-center justify-center text-muted" style={{ height: 260, opacity: 0.5 }}>
              <PieChart width={160} height={160}>
                <Pie data={[{value: 100}]} cx="50%" cy="50%" innerRadius={50} outerRadius={60} fill="var(--border-color)" dataKey="value" stroke="none" isAnimationActive={false} />
              </PieChart>
              <div style={{ marginTop: '-40px' }}>Añade una suscripción para ver el desglose</div>
            </div>
          )}
        </div>

        <div className="glass-panel flex-col">
          <h2 className="title-md">Impacto por Suscripción</h2>
          {topExpenses.length > 0 ? (
            <div className="flex-col gap-4">
              {topExpenses.map((sub, idx) => (
                <div key={sub.id} className="flex justify-between items-center glass-panel-sm" style={{ borderLeft: `4px solid ${COLORS[idx % COLORS.length]}` }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{sub.name}</div>
                    <div className="text-muted">{sub.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{sub.price}€</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {sub.frequency === 'monthly' ? 'Mensual' : 'Anual'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-col items-center justify-center text-muted h-full" style={{ padding: '40px 0', opacity: 0.5 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📊</div>
              <p>Tus gastos más altos aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
