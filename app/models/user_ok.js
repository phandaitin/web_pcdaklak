const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    user        :   String  ,
    email       :   String  ,
    pass        :   String  ,      
    role        :   String        
},{ timestamps: true} 
);   
schema.pre('save', function (next){
    const string  = bcrypt.genSaltSync(10);
    this.pass = bcrypt.hashSync(this.pass, string);
    next();
})

module.exports = mongoose.model('user_ok', schema );    
 
 