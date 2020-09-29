const Tour = require('./../models/tourModel');


//2. ROUTEHANDLERS
//get all the tours save in the db
exports.getAllTours = async (req, res) => {
    try {
        //BUILD QUERY
        
        // 1A) FILTERING
        const queryObj = {...req.query} 
        const excludedFiles = ['page','sort','limit','fields'];
        excludedFiles.forEach(el => delete queryObj[el]);
        
        // 1B) ADVANCED FILTERING --> for gte,gt,lte,lt in query string i.e duration[gte]=5
        let queryStr = JSON.stringify(queryObj);
        queryStr =  queryStr.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        
        let query = Tour.find(JSON.parse(queryStr));
        
        // 2) SORTING 
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        
        // 3) Field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); 
        } else {
            query = query.select('-__v')
        }
        
        // 4) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        
        // page = 3&limit=10,1-10 page 1,11-20 page 2,21-30 page 3...
        query = query.skip(skip).limit(limit);
        
        if(req.query.page) {
            const numTours = await Tour.countDocuments();
            if(skip>=numTours) throw new Error('This page does not exist');
        }
        
        //EXECUTE THE QUERY
        const tours = await query;
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