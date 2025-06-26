const Resort = require('../models/resort');

// Get all resorts
const getAllResorts = async() =>{
    try{
        return await Resort.findAll();
    }catch(err){
        console.error('Error fetching resorts:', err);
        throw new Error('Could not fetch resorts');
    }
}

// Add new resort
const createResort = async(resortData)=>{
    try{
        return await Resort.create(resortData);
    }catch(err){
        console.error('Error creating resort:', err);
        throw new Error('Could not create resort');
    }
}


module.exports ={
    getAllResorts,
    createResort
};