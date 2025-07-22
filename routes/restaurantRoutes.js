const express = require('express');
const router = express.Router();
const {getAllRestaurantscontroller, getRestaurantByIdController, createRestaurantController, updateRestaurantController, deleteRestaurantController, changeStateController } = require('../controllers/restaurantController');

router.get('/', getAllRestaurantscontroller);
router.get('/:id', getRestaurantByIdController);
router.post('/', createRestaurantController);
router.put('/:id', updateRestaurantController);
router.delete('/:id', deleteRestaurantController);
router.post('/:id/change-state', changeStateController);


module.exports = router;