const Goal = require('../models/Goal');

// @desc    Obtener metas de ahorro del usuario
// @route   GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear nueva meta de ahorro
// @route   POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { nombre, montoMeta, montoActual, fechaLimite } = req.body;
    const targetAmount = Number(montoMeta);
    const initialAmount = montoActual ? Number(montoActual) : 0;

    if (isNaN(targetAmount) || targetAmount <= 0) {
      return res.status(400).json({ message: 'El monto meta debe ser mayor a 0' });
    }

    if (isNaN(initialAmount) || initialAmount < 0) {
      return res.status(400).json({ message: 'El monto inicial no puede ser negativo' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      nombre,
      montoMeta: targetAmount,
      montoActual: initialAmount,
      fechaLimite,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Abonar dinero a una meta de ahorro
// @route   PATCH /api/goals/:id/abonar
const abonarGoal = async (req, res) => {
  try {
    const abono = Number(req.body.monto);

    if (isNaN(abono) || abono <= 0) {
      return res.status(400).json({
        message: 'El monto a abonar debe ser estrictamente numérico y mayor a 0',
      });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
    }

    goal.montoActual += abono;
    // El hook pre('save') en el modelo cambiará el estado a 'Completada' si montoActual >= montoMeta
    const updatedGoal = await goal.save();

    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Eliminar una meta de ahorro
// @route   DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Meta de ahorro no encontrada' });
    }

    res.json({ message: 'Meta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  abonarGoal,
  deleteGoal,
};