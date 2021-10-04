const express = require('express');
const router 	= express.Router();
const chuyenmucModel= require(__path_models + '/chuyenmuc');
 let collection ='gioithieu'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';   


router.get('/', async (req,res,next) => {     
    try {         
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')   
        // ------------------------------------------------
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu 
        })
    } catch (error) {
        res.status(400).json({data : error  })
    }
 
 
});
 

module.exports = router;