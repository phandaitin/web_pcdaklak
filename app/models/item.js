const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);


const schema = new mongoose.Schema({
    name        :   {type: String , required:true },
    email       :   String, 
    pass       :   String, 
    title       :   String, 
    slug: { type: String, slug: 'title', unique: true },
    content     :   String, 
    status      :   String, 
    position   :   String, 
    typeshow    :   Number,
    order       :   Number,
    seen        :   {type: Number , default :0},
    radio       :   Boolean,
    fileUpload  :   String, 
    tablemain   : {       
        name: String,
        fullname:  String
    },
},{ timestamps: true} 
);    
module.exports = mongoose.model('item', schema );   //item i a colectiton in db mongo
 
 