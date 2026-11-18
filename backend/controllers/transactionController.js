const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

// @desc    Obtener transacciones del usuario con filtros (tipo, mes, categoria)
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { tipo, mes, categoria } = req.query;
    const query = { userId: req.user._id };

    if (tipo && ['ingreso', 'egreso'].includes(tipo)) {
      query.tipo = tipo;
    }

    if (categoria) {
      query.categoria = categoria;
    }

    // Filtro por mes en formato YYYY-MM
    if (mes) {
      const [year, month] = mes.split('-').map(Number);
      if (year && month) {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        query.fecha = { $gte: startDate, $lte: endDate };
      }
    }

    const transactions = await Transaction.find(query).sort({ fecha: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear nueva transacción
// @route   POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { tipo, monto, categoria, descripcion, fecha } = req.body;
    const numericAmount = Number(monto);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser estrictamente numérico y mayor a 0',
      });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      tipo,
      monto: numericAmount,
      categoria,
      descripcion,
      fecha: fecha || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Actualizar transacción del usuario
// @route   PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    if (req.body.monto !== undefined) {
      const numericAmount = Number(req.body.monto);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          message: 'El monto debe ser estrictamente numérico y mayor a 0',
        });
      }
      transaction.monto = numericAmount;
    }

    transaction.tipo = req.body.tipo ?? transaction.tipo;
    transaction.categoria = req.body.categoria ?? transaction.categoria;
    transaction.descripcion = req.body.descripcion ?? transaction.descripcion;
    transaction.fecha = req.body.fecha ?? transaction.fecha;

    const updated = await transaction.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Eliminar transacción del usuario
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    res.json({ message: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener KPIs y desglose por categoría del mes activo
// @route   GET /api/transactions/dashboard?mes=YYYY-MM
const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const defaultMes = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const mes = req.query.mes || defaultMes;

    const [year, month] = mes.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const transactions = await Transaction.find({
      userId: req.user._id,
      fecha: { $gte: startDate, $lte: endDate },
    });

    const goals = await Goal.find({ userId: req.user._id });
    const totalAhorradoMetas = goals.reduce((acc, g) => acc + g.montoActual, 0);

    let totalIngresos = 0;
    let totalGastos = 0;
    const gastosPorCategoriaMap = {};

    transactions.forEach((t) => {
      if (t.tipo === 'ingreso') {
        totalIngresos += t.monto;
      } else if (t.tipo === 'egreso') {
        totalGastos += t.monto;
        gastosPorCategoriaMap[t.categoria] =
          (gastosPorCategoriaMap[t.categoria] || 0) + t.monto;
      }
    });

    const balance = totalIngresos - totalGastos;

    // Convertir mapa de gastos a arreglo con porcentaje respecto al total de gastos
    const gastosPorCategoria = Object.entries(gastosPorCategoriaMap)
      .map(([categoria, total]) => ({
        categoria,
        total,
        porcentaje: totalGastos > 0 ? Math.round((total / totalGastos) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    res.json({
      mesActivo: mes,
      kpis: {
        balance,
        ingresos: totalIngresos,
        gastos: totalGastos,
        ahorro: totalAhorradoMetas,
      },
      gastosPorCategoria,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardAnalytics,
};