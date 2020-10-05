const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({ 
    name:{
        type:String, 
        required:[true,'A tour must have a name.'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour must have at least 40 characters'],
        minlength:[10,'A tour must have at least 10 characters'],
        validate: [validator.isAlpha,'tour should be only contains alphanumeric characters']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true,'A tour must have a durations.']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a GroupSize.']
    }, 
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty.'],
        enum:{
            values:['easy','medium','difficult'],
            message: 'Difficulty is either easy,medium,difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity:{
        type: Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price.']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator: function (val) {
                return val < this.price; //this object only points on new docu create not going to work on update 
            },
            message:'Discount price({VALUE}) must be below regular price.'
        }
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have a summary description.']
    }, 
    description:{
        type:String,
        trim:true
    }, 
    imageCover:{
        type:String,
        required:[true,'A tour must have an image cover']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }
    },
    {
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
    });

//virtual properties
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})

//DOCUMENT MIDDLEWARES
//run before an actual event 'save' run before save() and create() but not before insertMany() 'save' is the hooks/middleware here
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lowercase: true});
    next();
});

// tourSchema.pre('save',function(next){
//     console.log('Will save document...');
//     next();
// })
// //run after saving a document into DB
// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// });

//QUERY MIDDLEWARES
//'find' defines it's a query middleware coz not it'll work on current query not current document 
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/,function(docs,next){
    // console.log(`Query took ${Date.now() - this.start} milliseconds`)
    // console.log(docs);
    next();
})

//AGGREGATION MIDDLEWARES
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match: {secretTour: {$ne:true}} });
    //console.log(this.pipeline())
    next();
})

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;