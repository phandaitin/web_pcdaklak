const express = require('express');
const path = require('path');

const expressLayouts = require('express-ejs-layouts');
const moment = require('moment')
////////////////////////////////////////////////
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');
////////////////////////////////////////////////
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
///////////////////////////////////////////////
// const countapi = require('countapi-js');
// countapi.visits().then((result) => {
//   global.visitTimes = result.value ;
// });
// ------------------------------------------------
const app = new express();

const mongoose  = require('mongoose');


// Define Path
const pathConfig = require('./path');
global.__base                   = __dirname + '/';
global.__path_public            = __base + pathConfig.folder_public +'/';
global.__path_app               = __base + pathConfig.folder_app +'/';
global.__path_config          = __path_app + pathConfig.folder_config +'/';
global.__path_helpers          = __path_app + pathConfig.folder_helpers +'/';
global.__path_controllers       = __path_app + pathConfig.folder_controllers +'/';
global.__path_views             = __path_app + pathConfig.folder_views +'/';
global.__path_models            = __path_app + pathConfig.folder_models +'/';
global.__path_schemas           = __path_app + pathConfig.folder_schemas  +'/';
global.__path_validates         = __path_app + pathConfig.folder_validates  +'/';
global.__path_views_admin       = __path_views +pathConfig.folder_views_admin +'/'; //mvc
global.__path_views_blog        = __path_views +pathConfig.folder_views_blog +'/'; //mvc
global.__path_uploads           =__path_public + pathConfig.folder_uploads ;

// ----------------------------------------------

// global.loggedIn = null;
// app.use("*",(req,res,next) =>{
//      loggedIn = req.session.userID
//     next()
// })
 
//--------POST ANH CHO CKEDITOR -------------------------
app.post('/upload',multipartMiddleware,(req,res)=>{
  try {
      fs.readFile(req.files.upload.path, function (err, data) {
          var newPath = __dirname + '/public/uploads/baiviet/' + req.files.upload.name;
          fs.writeFile(newPath, data, function (err) {
              if (err) console.log({err: err});
              else {
                //  console.log(req.files.upload.originalFilename);
              //     imgl = '/images/req.files.upload.originalFilename';
              //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
              //    res.status(201).send(img);
               
                  let fileName = req.files.upload.name;
                  let url = 'http://localhost:3000/uploads/baiviet/'+fileName;                    
                  let msg = 'Upload file thành công';
                  let funcNum = req.query.CKEditorFuncNum;
                 // console.log({url,msg,funcNum});
                 
                  res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
              }
          });
      });
     } catch (error) {
         console.log(error.message);
     }
})
//////////////////////////////////////


// app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);app.set('layout',__path_views_admin +'backend');

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// 3 pkg này nhớ đặt sau const app = new express();
app.use(cookieParser('secret'));
app.use(flash()); 
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2*60000 }
}));


//SETUP ROUTER
const systemConfig      = require(__path_config + 'system');
const databaseConfig    = require(__path_config + 'database');
app.locals.systemConfig = systemConfig;
app.locals.databaseConfig = databaseConfig;
app.locals.moment       = moment;

// const db   = require(__path_config + 'database'); // phải cài thư viện config nhá
// db.connect(); // cho cach 1// db.connect; // cho cach 2


//  mongoose.connect(`mongodb://${databaseConfig.username}:${databaseConfig.password}@ds117590.mlab.com:17590/${databaseConfig.database}`, { useNewUrlParser: true });
const uri ='mongodb://localhost:27017/db_webpcdaklak';
//const uri ='mongodb+srv://127.0.0.1:27017/?poolSize=20&writeConcern=majority';
mongoose.connect(uri,{  useNewUrlParser: true,  useUnifiedTopology: true   });



app.use(`/${systemConfig.prefixAdmin}`, require(__path_controllers +'admin'));  // mặc định gọi đến :..../app/routes/index.js
app.use(`/${systemConfig.prefixBlog}`, require(__path_controllers +'blog'));  // mặc định gọi đến :..../app/routes/index.js



// const port = 3000;
const port = process.env.port || 3000;
app.listen(port, () => { console.log(`server is runing on port: ${port}`) })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(async(err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    if(systemConfig.env == "dev") {
      res.status(err.status || 500);
      res.render(__path_views_admin +  '/error', { pageTitle   : 'Xem lỗi bên dưới' });
    }
  
    // render the error page
    if(systemConfig.env == "prod") {
      res.status(err.status || 500);
      res.render(__path_views_blog +  '/error', {        
        layout: __path_views_blog + 'error'
      });
    }
    
  });