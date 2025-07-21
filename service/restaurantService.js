const AppError = require('../util/AppError');
const Restaurant = require('../model/restaurant');
const DiningTable = require('../model/table');
const Resort = require('../model/resort');

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

const updateRestaurant = async (id, {restaurantName, resort_id}) => {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
    }

    const resort = await Restaurant.findOne({ where: { resort_id } });
    if (!resort) {
        throw new AppError(404, 'Resort not found');
    }

    await restaurant.update({restaurantName, resort_id});
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