const Resort = require('../models/resort');
const { getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, changeState } = require('../services/restaurantService');

const getAllRestaurantscontroller = async (req, res) => {
    try {
        const restaurants = await getAllRestaurants();
        res.status(200).json({
            success: true,
            message: 'Restaurants retrieved successfully',
            data: restaurants
        });
    } catch (error) {
       console.error('Error retrieving restaurants:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving restaurants',
            error: error.message
        });
    }
};

const getRestaurantByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await getRestaurantById(id); // use PK
        res.status(200).json({
            success: true,
            message: 'Restaurant retrieved successfully',
            data: restaurant
        });
    } catch (error) {
        console.error('Error retrieving restaurant:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

const createRestaurantController = async (req, res) => {
    const { resort_id, restaurantName } = req.body;

    if (!restaurantName || !resort_id) {
        return res.status(400).json({
            success: false,
            message: 'Restaurant name and resort ID are required'
        });
    }

    // Check if resort exists
    const resort = await Resort.findByPk(resort_id);
    if (!resort) {
        return res.status(404).json({
            success: false,
            message: 'Resort not found'
        });
    }

    try {
        const newRestaurant = await createRestaurant({restaurantName, resort_id});
        res.status(201).json({
            success: true,
            message: 'Restaurant created successfully',
            data: newRestaurant
        });
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateRestaurantController = async (req, res) => {
    const { id } = req.params; // id means PK
    const { restaurantName, resort_id } = req.body; // ansure to send the whole object in frontend - updated feilds and others

    if (!restaurantName) {
        return res.status(400).json({
            success: false,
            message: 'Restaurant number and name are required'
        });
    }

    try {
        const updatedRestaurant = await updateRestaurant(id, {restaurantName, resort_id});
        res.status(200).json({
            success: true,
            message: 'Restaurant updated successfully',
            data: updatedRestaurant
        });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRestaurantController = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRestaurant(id);
        res.status(200).json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const changeStateController = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await changeState(id);
        res.status(200).json({
            success: true,
            message: `${restaurant.restaurantName} status changed successfully to ${restaurant.status}`,
            data: restaurant
        });
        
    } catch (error) {
        console.error('Error changing restaurant state:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllRestaurantscontroller,
    getRestaurantByIdController,
    createRestaurantController,
    updateRestaurantController,
    deleteRestaurantController,
    changeStateController
}