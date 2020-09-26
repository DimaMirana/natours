const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');


//console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);


//connect with db
mongoose.connect(DB,{ 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(connection =>{
    //console.log(connection.connections);
    console.log('DB connection successful');
});

//Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
