const mongoose=require('mongoose');
require('dotenv').config();


    const dbUrl =mongoose.connect (process.env.DATABASE_URL || "mongodb://localhost:27017/defaultdb");

    dbUrl.then(()=>{
        console.log("Database connected successfully");
    })
    .catch(()=>{
        console.log("database is not connected")
    })

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
       type:String,
       require:true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const collection= new mongoose.model('user1',userSchema)
module.exports = collection;
