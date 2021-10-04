const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const schema = new mongoose.Schema({
    name: String,    
    slug: { type: String, slug: 'name', unique: true },
    title: String,        
    content: String,
    fileUpload:String, 
    status  : String,
    position: String,
    order   : Number ,
    seen    :{
        type: Number , 
        default :0
    },
    tmain: {
        id:  String,
        name: String 
    },
},{ timestamps: true} 
);    
module.exports = mongoose.model('baiviet', schema );   //baiviet i a colectiton in db mongo
    
    