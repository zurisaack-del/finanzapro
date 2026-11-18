import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Coins } from 'lucide-react';
import api from '../services/api';
import AbonarModal from '../components/AbonarModal';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ nombre: '', montoMeta: '', montoActual: '', fechaLimite: '' });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [error, setError] = useState('');

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (err) {
      console.error('Error cargando metas:', err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/goals', {
        nombre: form.nombre,
        montoMeta: Number(form.montoMeta),
        montoActual: form.montoActual ? Number(form.montoActual) : 0,
        fechaLimite: form.fechaLimite,
      });
      setForm({ nombre: '', montoMeta: '', montoActual: '', fechaLimite: '' });
      fetchGoals();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la meta');
    }
  };

  const handleAbonar = async (goalId, monto) => {
    await api.patch(`/goals/${goalId}/abonar`, { monto });
    fetchGoals();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta meta de ahorro?')) return;
    await api.delete(`/goals/${id}`);
    fetchGoals();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Metas de Ahorro</h1>
        <p className="text-sm text-slate-500">Define objetivos financieros y registra tus abonos</p>
      </div>

      {/* Formulario rápido para crear meta */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4"
      >
        <h2 className="text-base font-semibold text-slate-800">Nueva Meta Financiera</h2>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            required
            placeholder="Nombre (ej. Fondo Emergencia)"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="Monto Meta (Bs.)"
            value={form.montoMeta}
            onChange={(e) => setForm({ ...form, montoMeta: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monto Inicial (opcional)"
            value={form.montoActual}
            onChange={(e) => setForm({ ...form, montoActual: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            required
            value={form.fechaLimite}
            onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Crear Meta
          </button>
        </div>
      </form>

      {/* Lista de metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const isCompleted = goal.estado === 'Completada';
          return (
            <div
              key={goal._id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{goal.nombre}</h3>
                    <p className="text-xs text-slate-500">
                      Fecha límite:{' '}
                      {new Date(goal.fechaLimite).toLocaleDateString('es-BO', { timeZone: 'UTC' })}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {goal.estado}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">
                      Bs. <strong>{goal.montoActual.toFixed(2)}</strong> de Bs.{' '}
                      {goal.montoMeta.toFixed(2)}
                    </span>
                    <span className="font-bold text-emerald-600">{goal.progreso}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${goal.progreso}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedGoal(goal)}
                  disabled={isCompleted}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 rounded-lg text-sm font-semibold transition"
                >
                  <Coins className="w-4 h-4" />
                  Abonar
                </button>

                <button
                  onClick={() => handleDelete(goal._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Eliminar meta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <AbonarModal
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
        onAbonar={handleAbonar}
      />
    </div>
  );
}