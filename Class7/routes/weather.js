const express = require('express');
const router = express.Router();
const weatherDAO = require('../dao/weatherDAO');

///////////////////
// READ weather //
/////////////////
router.get('/', (req, res) => {
    res.render('weather');
});

/////////////////////////////////////////////
// READ weather at the specified location //
///////////////////////////////////////////
router.get('/location', async (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.sendStatus(400);
    }

    try {
        const temp = await weatherDAO.getTemperatureByLocation(name);

        if (temp === null) {
            return res.render('location', { name, error: 'Temperature data not found.' });
        }

        res.render('location', { name, temperature: temp });
    } 
    
    catch (error) {
        res.sendStatus(500);
    }
});


module.exports = router;