const express = require('express');
const router = express.Router();
const {getAllRestaurantscontroller, getRestaurantByIdController, createRestaurantController, updateRestaurantController, deleteRestaurantController, } = require('../controller/restaurantController');

router.get('/', getAllRestaurantscontroller);
router.get('/:id', getRestaurantByIdController);
router.post('/', createRestaurantController);
router.put('/:id', updateRestaurantController);
router.delete('/:id', deleteRestaurantController);

module.exports = router;