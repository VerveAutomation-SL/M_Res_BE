const AppError = require('../util/AppError');
const Restaurant = require('../model/restaurant');
const DiningTable = require('../model/table');

const getAllRestaurants = async () => {
    return await Restaurant.findAll({
        include: [{
            model: DiningTable,
            as: "diningTables"
        }]
    })
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

const createRestaurant = async ({restaurantNumber, restaurantName}) => {
    const existingRestaurant = await Restaurant.findOne({ 
        where: { 
            restaurantNumber : restaurantNumber, 
        }});
    if (existingRestaurant) {
        throw new AppError(400, `Restaurant with number- ${restaurantNumber} already exists`);
    }
    const restaurant = await Restaurant.create({restaurantNumber, restaurantName})
    return restaurant;
};

const updateRestaurant = async (id, {restaurantNumber, restaurantName}) => {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    await restaurant.update({restaurantNumber, restaurantName});
    return restaurant;
}

const deleteRestaurant = async (id) => {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }
    await restaurant.destroy();
}

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};