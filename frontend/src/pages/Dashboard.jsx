import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import api from '../services/api';
import KpiCards from '../components/KpiCards';
import CategoryBarChart from '../components/CategoryBarChart';

export default function Dashboard() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [mes, setMes] = useState(currentMonth);
  const [analytics, setAnalytics] = useState({
    kpis: { balance: 0, ingresos: 0, gastos: 0, ahorro: 0 },
    gastosPorCategoria: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/transactions/dashboard?mes=${mes}`);
        setAnalytics(data);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [mes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel Analítico</h1>
          <p className="text-sm text-slate-500">Resumen financiero del mes activo</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="text-sm font-medium text-slate-700 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando analíticas...</div>
      ) : (
        <>
          <KpiCards kpis={analytics.kpis} />
          <CategoryBarChart data={analytics.gastosPorCategoria} />
        </>
      )}
    </div>
  );
}