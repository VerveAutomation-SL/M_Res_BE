const AppError = require('../utils/AppError');
const Restaurant = require('../models/restaurant');
const DiningTable = require('../models/table');
const Resort = require('../models/resort');
const { getResortById } = require('./resortService');

const getAllRestaurants = async () => {
    return await Restaurant.findAll({
        include: [
            {
                model: DiningTable,
                as: "diningTables",
            },
            {
                model: Resort,
                as: "resort",
                attributes: ['id', 'name', 'location'],
            },
        ],
    });
}

const getRestaurantById = async (id) => {
    const restaurant = await Restaurant.findByPk(id, {
        include: [{
            model: DiningTable,
            as: "diningTables"
        }]
    });
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    return restaurant;
}

const createRestaurant = async ({restaurantName, resort_id}) => {
    const existingRestaurant = await Restaurant.findOne({ 
        where: { 
            restaurantName : restaurantName, 
            resort_id: resort_id
        }});
    if (existingRestaurant) {
        throw new AppError(400, `Restaurant with name- ${restaurantName} already exists`);
    }
    const restaurant = await Restaurant.create({restaurantName, resort_id})
    return restaurant;
};

const updateRestaurant = async (id, {restaurantName, resort_id, status}) => {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    console.log(`Updating restaurant ${restaurant.restaurantName} with new name ${restaurantName}, resort_id ${resort_id}, and status ${status}`);

    const resort = await getResortById(resort_id);
    if (!resort) {
        throw new AppError(404, 'Resort not found');
    }
    await restaurant.update({restaurantName, resort_id, status});
    return restaurant;
}

const deleteRestaurant = async (id) => {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    await restaurant.destroy();
}

const changeState = async (id) => {
    const restaurant = await getRestaurantById(id);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        const status = restaurant.status === 'Open' ? 'Close' : 'Open';
        return await restaurant.update({ status });
}

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    changeState
};