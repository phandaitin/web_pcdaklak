const express = require('express');
const router 	= express.Router();
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const phuongthucvanhanhModel     = require(__path_models + '/phuongthucvanhanh');
 let collection ='phuongthucvanhanh'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';
   


router.get('/', async (req,res,next) => {     
    try {         
       // let idLichcatdien	= paramsHelpers.getParam(req.params, 'id', '');
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')   
            
        let phuongthucvanhanh = await phuongthucvanhanhModel
            .find({})                                          
            .limit(30) 
            .sort({ updatedAt :  -1})
            .select ('name fileUpload updatedAt')  
        // ------------------------------------------------
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu,
            phuongthucvanhanh 
        })
    } catch (error) {
        res.status(400).json({data : error  })
    }
 
 
});
 

module.exports = router;