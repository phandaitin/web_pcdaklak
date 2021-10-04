const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    name        :   {type: String , required:true },
    fullname    :   String    ,
    email       :   String    ,
    pass        :   String    ,
    fileUpload  :   String  , 
    tmain :{
        id: String ,
        name: String 
    },
},{ timestamps: true} 
);    

schema.pre('save', function (next){
    const string  = bcrypt.genSaltSync(10);
    this.pass = bcrypt.hashSync(this.pass, string);
    next();
})
module.exports = mongoose.model('user', schema );   //group i a colectiton in db mongo
 
 