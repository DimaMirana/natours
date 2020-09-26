const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();


// the user routes 
router
    .route('/')
    .get(userController.getAllUsers) //get all user data from the server
    .post(userController.createUser) //create a new user

router
    .route('/:id')
    .get(userController.getUser) //get a user of the specific id
    .patch(userController.updateUser) //update a user
    .delete(userController.deleteUser) //delete a user

module.exports = router;