
var express = require('express');
var router = express.Router();
const systemConfig = require(__path_config + 'system');
let linkLogin       = '/'+systemConfig.prefixAdmin + '/auth/login' ;
router.use('/auth', require('./auth'));

router.use('/' ,(req,res,next)=>{
    // console.log( req.session.userID );
    if(req.session.userID !== undefined){
        // console.log( req.session.userID );
        next()
    }
    else{
        res.redirect(linkLogin);
    }
    }, require('./dashboard'));


router.use('/item', require('./item'));
router.use('/group', require('./group'));
router.use('/user', require('./user'));


router.use('/user_ok', require('./user_ok'));

router.use('/chuyenmuc', require('./chuyenmuc'));
router.use('/baiviet', require('./baiviet'));

router.use('/kdoanh', require('./kdoanh'));
router.use('/video', require('./video'));

router.use('/phuongthucvanhanh', require('./phuongthucvanhanh'));
router.use('/lichdieudongxe', require('./lichdieudongxe'));
router.use('/thongbaomoihop', require('./thongbaomoihop'));

router.use('/ungdungnoibo', require('./ungdungnoibo'));

 
module.exports = router;

