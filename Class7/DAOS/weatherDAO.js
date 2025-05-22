const Weather = require('../models/weather');

///////////////////////////////////////////
// READ temperature using location name //
/////////////////////////////////////////
const getTemperatureByLocation = async (locationName) => {
    const weatherData = await Weather.findOne({ name: locationName });
    return weatherData ? weatherData.temperature : null;
};


module.exports = {
    getTemperatureByLocation,
};