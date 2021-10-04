const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: String,        
    khang: Number,
    tpham: Number,
    order   : Number     
},{ timestamps: true} 
);    
module.exports = mongoose.model('kdoanh', schema );   //kdoanh i a colectiton in db mongo
    
    