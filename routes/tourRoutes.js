const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//router.param('id',tourController.checkID);

// the tour routes
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours,tourController.getAllTours)
router
    .route('/')
    .get(tourController.getAllTours) //get all tours data from the server 
    .post(tourController.createTour) //chaining multiple middleware

router
    .route('/:id')
    .get(tourController.getTour) //get one specific tours data from the server 
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)
    
module.exports =router;