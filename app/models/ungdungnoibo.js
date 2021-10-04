const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: String,        
    fileUpload: String  ,
    link: String 
    },
    { timestamps: true} 
);    
module.exports = mongoose.model('ungdungnoibo', schema );   //ungdungnoino i a colectiton in db mongo
    
    