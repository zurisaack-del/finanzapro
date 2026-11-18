import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import api from '../services/api';
import TransactionModal, { CATEGORIAS } from '../components/TransactionModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ tipo: '', mes: '', categoria: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.mes) params.append('mes', filters.mes);
      if (filters.categoria) params.append('categoria', filters.categoria);

      const { data } = await api.get(`/transactions?${params.toString()}`);
      setTransactions(data);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleSave = async (txData) => {
    if (editingTx) {
      await api.put(`/transactions/${editingTx._id}`, txData);
    } else {
      await api.post('/transactions', txData);
    }
    setEditingTx(null);
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta transacción?')) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transacciones</h1>
          <p className="text-sm text-slate-500">Gestiona tus ingresos y egresos</p>
        </div>

        <button
          onClick={() => {
            setEditingTx(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Transacción
        </button>
      </div>

      {/* Filtros por tipo, mes y categoría */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filtrar por:</span>
        </div>

        <select
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>

        <input
          type="month"
          value={filters.mes}
          onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
        />

        <select
          value={filters.categoria}
          onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando movimientos...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No se encontraron transacciones con los filtros seleccionados.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(tx.fecha).toLocaleDateString('es-BO', { timeZone: 'UTC' })}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{tx.descripcion}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {tx.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.tipo === 'ingreso'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {tx.tipo}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      tx.tipo === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.tipo === 'ingreso' ? '+' : '-'} Bs. {tx.monto.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTx(tx);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingTx}
      />
    </div>
  );
}