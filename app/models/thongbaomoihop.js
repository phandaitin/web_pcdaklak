const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name: String,        
    fileUpload: String    
    },
    { timestamps: true} 
);    
module.exports = mongoose.model('thongbaomoihop', schema );   //thongbaomoihop i a colectiton in db mongo
    
    