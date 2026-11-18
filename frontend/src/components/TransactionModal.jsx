import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const CATEGORIAS = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Salario',
  'Freelance',
  'Inversiones',
  'Ahorro',
  'Otros',
];

export default function TransactionModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    tipo: 'egreso',
    monto: '',
    categoria: 'Alimentación',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        tipo: initialData.tipo,
        monto: initialData.monto,
        categoria: initialData.categoria,
        descripcion: initialData.descripcion,
        fecha: new Date(initialData.fecha).toISOString().split('T')[0],
      });
    } else {
      setForm({
        tipo: 'egreso',
        monto: '',
        categoria: 'Alimentación',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numMonto = Number(form.monto);
    if (isNaN(numMonto) || numMonto <= 0) {
      setError('El monto debe ser un número mayor a 0');
      return;
    }
    try {
      await onSave({ ...form, monto: numMonto });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la transacción');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['ingreso', 'egreso'].map((tipo) => (
              <button
                type="button"
                key={tipo}
                onClick={() => setForm({ ...form, tipo })}
                className={`py-2 rounded-lg text-sm font-semibold capitalize border transition ${
                  form.tipo === tipo
                    ? tipo === 'ingreso'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (Bs.)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej. 150.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input
              type="text"
              required
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej. Compra supermercado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              required
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}