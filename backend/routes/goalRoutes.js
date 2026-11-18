const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  abonarGoal,
  deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protege todas las rutas de metas

router.route('/').get(getGoals).post(createGoal);
router.patch('/:id/abonar', abonarGoal);
router.delete('/:id', deleteGoal);

module.exports = router;