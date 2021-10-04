const express = require('express');
const router 	= express.Router();
const systemConfig = require(__path_config + 'system');
const loginValidates  = require(__path_validates + '/login')
let folderView		= __path_views_admin  + 'pages/auth/' ;
let layoutLogin     = __path_views_admin  + 'login'; // E:\web_pcdaklak/app/views/admin/login
// let linkIndex       = '/'+systemConfig.prefixAdmin + '/dashboard/' ;
let linkLogin       = '/'+systemConfig.prefixAdmin + '/auth/login' ;

router.get('/login',  (req,res,next) => {             
        let data={};
        let notify={};
        res.render(`${folderView}login`,{ 
            layout : layoutLogin,
            data ,       
            notify            
        })    
});

router.get('/logout',  (req,res,next) => {     
    req.session.destroy(() =>{
        res.redirect('/');
     })
});

// POST xử lý cho cả 2 TH add và edit
router.post('/login', loginValidates, (req,res,next) => {      
    req.body = JSON.parse(JSON.stringify(req.body));      
    let data = Object.assign(req.body);
    res.render(`${folderView}login`,{        
        layout : layoutLogin,
        data ,
        notify: {err: 'User hoặc or password không khớp...'}             
    } )
     
 });

 
  




module.exports = router;
