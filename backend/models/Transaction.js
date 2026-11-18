const mongoose = require('mongoose');

const CATEGORIAS_PREDEFINIDAS = [
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

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tipo: {
      type: String,
      enum: ['ingreso', 'egreso'],
      required: [true, 'El tipo de transacción (ingreso/egreso) es obligatorio'],
    },
    monto: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      validate: {
        validator: function (val) {
          return typeof val === 'number' && !isNaN(val) && val > 0;
        },
        message: 'El monto debe ser estrictamente numérico y mayor a 0',
      },
    },
    categoria: {
      type: String,
      enum: {
        values: CATEGORIAS_PREDEFINIDAS,
        message: 'Categoría no válida',
      },
      required: [true, 'La categoría es obligatoria'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [200, 'La descripción no puede superar los 200 caracteres'],
    },
    fecha: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);