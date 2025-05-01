const express = require('express');
const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const UserDAO = require('../DAOS/userDAO');
const User = require('../models/userModel');


// Define Express middleware:
const authorizationMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.sendStatus(401);
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (error) {
        return res.sendStatus(401);
    }
};


router.get('/', authorizationMiddleware, async (req, res) => {
    const allUsers = await UserDAO.getAll();
    return res.send(allUsers);
});


router.post('/', async (req, res) => {
    const {email, password} = req.body;
    await UserDAO.create(email, password);
    return res.sendStatus(201);
});


//////////////
// SIGN UP //
////////////
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;

    // Unit test wording = "should return 400 when password isn't provided" / "should return 400 without a password":
    if (!password){
        return res.sendStatus(400);
    }

    // Unit test wording = "should return 400 with empty password":
    if (password.trim() === ''){
        return res.sendStatus(400);
    }

    try {
        // Check whether the user already exists:
        const existingUser = await UserDAO.findUserByEmail(email);
        if (existingUser) {
          return res.sendStatus(409);
        }

        // Otherwise, create the new user (password will be encrypted within DAO commands):
        await UserDAO.create(email, password);
        return res.sendStatus(200);
      } 
      catch (error) {
        return res.sendStatus(500);
      }
    });


/////////////
// LOG IN //
///////////
router.post('/login', async (req, res) => {
    const {email, password} = req.body;             // Gets email & password from HTTP body
    if(!password){
        return res.sendStatus(400);
    }

    try {
        const user = await UserDAO.login(email, password);  // Looks up user by email and gets hashed password
        if(!user){
            return res.sendStatus(401);
        }

        const token = jwt.sign( {
            // the payload is:
            email: user.email,
            userId: user._id,
        }, process.env.JWT_SECRET, {expiresIn: '30m'} );
    
        // Then return the token to the client:
        return res.sendStatus(200).send({token});
    }
    catch (error){
        return res.sendStatus(500)
    }
});


module.exports = router;