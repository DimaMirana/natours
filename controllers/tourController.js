const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// MIDDLEWARES
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};



//2. ROUTEHANDLERS
//get all the tours save in the db
exports.getAllTours = async (req, res) => {
    try {
        //EXECUTE THE QUERY
        const features = new APIFeatures(Tour.find(),req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;
        //query.sort().select().skip(skip).limit(limit)
        
        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message:err
        })
    }
};

//get one specific tour
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); //equivalent to Tour.findOne({_id:req.params.id})
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed'
        })
    }
};

//create one tour
exports.createTour =async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }

};

//update one specific tour
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<UPDATED TOUR>'
        }
    })
};

//delete a tour
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id); //equivalent to Tour.findOne({_id:req.params.id})
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed'
        })
    }
};