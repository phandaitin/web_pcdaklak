const express = require('express');
const router 	= express.Router();
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const ungdungnoiboModel     = require(__path_models + '/ungdungnoibo');
 let collection ='ungdungnoibo'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';
   


router.get('/', async (req,res,next) => {     
    try {         
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')   
            
        let ungdungnoibo = await ungdungnoiboModel
            .find({})                                          
            .limit(30) 
            .sort({ updatedAt :  -1})
            .select ('name link fileUpload updatedAt')  
        // ------------------------------------------------
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu,
            ungdungnoibo 
        })
    } catch (error) {
        res.status(400).json({data : error  })
    }
 
 
});
 

module.exports = router;