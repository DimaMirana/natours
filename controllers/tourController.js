const Tour = require('./../models/tourModel');

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// exports.checkID = (req, res,next,value) => {
//     //value -> value of the params here it's id
//     console.log('tour id is', value);
//     if (req.params.id * 1 > tours.length) {
//         //return is important as it stops go to the next()
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res,next) => {
//     console.log(req.body);
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     next();
// }

//2. ROUTEHANDLERS
//get all the tours save in the db
exports.getAllTours = async (req, res) => {
    try {
        //BUILD QUERY
        
        // 1) FILTERING
        const queryObj = {...req.query} //destructure creates a new object otherwise it'll be a reference and make a key value pair 
        const excludedFiles = ['page','sort','limit','fields'];
        excludedFiles.forEach(el => delete queryObj[el]);
        //console.log(req.query,queryObj);
        
        // 2) ADVANCED FILTERING --> for gte,gt,lte,lt in query string i.e duration[gte]=5
        let queryStr = JSON.stringify(queryObj);
        queryStr =  queryStr.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        console.log(JSON.parse(queryStr));
        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(req.query.duration)
        //     .where('difficulty')
        //     .equals(req.query.difficulty);
        // {difficulty:easy,duration:{$gte:req.query.duration}}
        // gte,gt,lte,lt 
        const query = Tour.find(JSON.parse(queryStr));
        //console.log(query)
        //EXECUTE THE QUERY
        const tours = await query;
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
        //console.log(req.params.id);
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
    
    //console.log(req.params);
    // const id = req.params.id * 1; //parse into int 
    // const tour = tours.find(el => el.id === id)

    // if (!tour) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     });
    // }


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
    
    //console.log(req.body); the data in json obj 

    // const newId = tours[tours.length - 1].id + 1
    // const newTour = Object.assign({ id: newId }, req.body);

    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        
    // })
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