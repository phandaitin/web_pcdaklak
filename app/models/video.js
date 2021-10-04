const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name    : String,        
    idvideo   : String  ,  
    seen: Number
    
},{ timestamps: true} 
);    
module.exports = mongoose.model('video', schema );   //video i a colectiton in db mongo
    
    