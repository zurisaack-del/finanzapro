export default function CategoryBarChart({ data }) {
  const barColors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Distribución de Gastos por Categoría
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">
          No hay gastos registrados en el mes seleccionado.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={item.categoria}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{item.categoria}</span>
                <span className="text-slate-600">
                  Bs. {item.total.toFixed(2)}{' '}
                  <strong className="text-slate-800">({item.porcentaje}%)</strong>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    barColors[idx % barColors.length]
                  }`}
                  style={{ width: `${item.porcentaje}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}