import { useState } from 'react';
import { X } from 'lucide-react';

export default function AbonarModal({ goal, onClose, onAbonar }) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState('');

  if (!goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numeric = Number(monto);
    if (isNaN(numeric) || numeric <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }
    try {
      await onAbonar(goal._id, numeric);
      setMonto('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el abono');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-slate-800">Abonar a Meta</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Meta: <strong>{goal.nombre}</strong> (Faltan Bs.{' '}
          {Math.max(goal.montoMeta - goal.montoActual, 0).toFixed(2)})
        </p>

        {error && (
          <div className="mb-3 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monto a abonar (Bs.)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej. 200.00"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
            >
              Confirmar Abono
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}