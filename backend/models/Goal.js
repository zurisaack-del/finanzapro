const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre de la meta es obligatorio'],
      trim: true,
    },
    montoMeta: {
      type: Number,
      required: [true, 'El monto meta es obligatorio'],
      validate: {
        validator: (val) => typeof val === 'number' && !isNaN(val) && val > 0,
        message: 'El monto meta debe ser mayor a 0',
      },
    },
    montoActual: {
      type: Number,
      default: 0,
      min: [0, 'El monto actual no puede ser negativo'],
    },
    fechaLimite: {
      type: Date,
      required: [true, 'La fecha límite es obligatoria'],
    },
    estado: {
      type: String,
      enum: ['En progreso', 'Completada'],
      default: 'En progreso',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para obtener siempre el porcentaje exacto de progreso
goalSchema.virtual('progreso').get(function () {
  if (!this.montoMeta || this.montoMeta <= 0) return 0;
  const porcentaje = (this.montoActual / this.montoMeta) * 100;
  return Math.min(Math.round(porcentaje * 100) / 100, 100);
});

// Middleware para actualizar el estado automáticamente al guardar
goalSchema.pre('save', function (next) {
  if (this.montoActual >= this.montoMeta) {
    this.estado = 'Completada';
  } else {
    this.estado = 'En progreso';
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);