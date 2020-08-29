const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require("dotenv/config");

const app = express();

//Middlewares
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors());

//Import Routes
const usersRoute = require('./routes/users');
const investmentsRoute = require('./routes/investment');

app.use('/users',usersRoute);
app.use('/investments',investmentsRoute);

//ROUTES
app.get('/',(req,res)=>{
    
})

//Connect to DB
try{
mongoose.connect(process.env.DB_CONNECTION, 
    { useNewUrlParser:true, useUnifiedTopology: true  }, 
    ()=>{console.log("connected")
})
}catch(err){
    console.log(err)
}

mongoose.connection.on("error",(err)=>{
    console.log(err)
})

//Start listening to the server
app.listen(3001,()=>{
    console.log("server running on port 3001...")
});