const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const schema = new mongoose.Schema({
    name        : String ,    
    slug: { type: String, slug: 'name', unique: true },
    status      : String ,
    order       : Number,
    toppost     : { type: Number, default:3},
    typeshow    : Number 
    },
    { 
        timestamps: true
    }    
)
 module.exports = mongoose.model('chuyenmuc', schema ); 