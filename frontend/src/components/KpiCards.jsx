import { Scale, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export default function KpiCards({ kpis }) {
  const formatMoney = (amount) =>
    new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const cards = [
    {
      title: 'Balance del Mes',
      value: formatMoney(kpis.balance),
      icon: Scale,
      color: kpis.balance >= 0 ? 'text-blue-600 bg-blue-50' : 'text-rose-600 bg-rose-50',
      valueColor: kpis.balance >= 0 ? 'text-slate-900' : 'text-rose-600',
    },
    {
      title: 'Ingresos',
      value: formatMoney(kpis.ingresos),
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
      valueColor: 'text-emerald-600',
    },
    {
      title: 'Gastos',
      value: formatMoney(kpis.gastos),
      icon: TrendingDown,
      color: 'text-rose-600 bg-rose-50',
      valueColor: 'text-rose-600',
    },
    {
      title: 'Total Ahorrado en Metas',
      value: formatMoney(kpis.ahorro),
      icon: PiggyBank,
      color: 'text-amber-600 bg-amber-50',
      valueColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {card.title}
              </p>
              <p className={`text-xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}