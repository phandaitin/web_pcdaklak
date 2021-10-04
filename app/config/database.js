module.exports = {
    username    : 'phantin',
    password    : '12345679',
    database    : 'db_webpcdaklak' ,
    cluster     : 'cluster0.zey4s'
};


// // begin

const mongoose = require('mongoose');
// const uri ='mongodb+srv://phantin:12345679@cluster0.zey4s.mongodb.net/db_webpcdaklak?retryWrites=true&w=majority'
const uri ='mongodb://localhost:27017/db_webpcdaklak';
   async function connect(){  
    try {
        await  mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true                 
        });
        console.log('DB Connected !!!');
    } catch (error) {
         console.log('Loi ket noi toi DB: ' +error.message);
         process.exit(1);        
    }
    finally{
        mongoose.connection.close();
    }
}
 module.exports= {connect} // bên app gọi = databse.connect(); /
//  module.exports= {connect} // bên app gọi = databse.connect(); / cho cach 2
// //module.exports= connect     // bee


//end
// const connectDB = async () =>{
//     const conn = await new mongoose("mongodb+srv://nikunj:gadia7420@cluster0.94xph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//     {
//         usenewurlparser:true,
//         usecreateindex:true,
//         usefindmodify:true,
//         useunifiedtropology:true,
//         urlencoded:true
//     })
// }
// module.exports = connectDB;