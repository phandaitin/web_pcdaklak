
var express = require('express');
var router = express.Router();
 
router.use('/', require('./home')); 
router.use('/tin-tuc-tong-hop/', require('./chuyenmuc')); 
router.use('/bai-viet/', require('./baiviet')); 
router.use('/bai-viet-search/', require('./baivietsearch')); 
router.use('/tin-tieu-diem/', require('./baiviet')); 

router.use('/phuong-thuc-van-hanh/', require('./phuongthucvanhanh')); 
router.use('/lich-dieu-dong-xe/', require('./lichdieudongxe')); 
router.use('/thong-bao-moi-hop/', require('./thongbaomoihop')); 

router.use('/ung-dung-noi-bo/', require('./ungdungnoibo')); 

router.use('/dien-luc-truc-thuoc/', require('./dienluctructhuoc')); 
router.use('/gioi-thieu/', require('./gioithieu')); 
router.use('/so-do-to-chuc/', require('./sodotochuc')); 
 

 

module.exports = router;

