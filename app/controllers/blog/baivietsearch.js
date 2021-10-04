const express = require('express');
const router 	= express.Router();
const baivietModel= require(__path_models + '/baiviet');
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const paramsHelpers  = require(__path_helpers + '/params')
 let collection ='baivietsearch'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';

 router.get('/', async (req,res,next) => {          
    let objWhere    = {};
    let keyword     =  paramsHelpers.getParam(req.query, 'keyword', '');
    if(keyword !== ''){
       objWhere.name = (new  RegExp(keyword , 'ig') )
        // return `<mark> ${objWhere.name} </mark>`;
    }
        //`<mark>${new RegExp(keyword , 'ig')}</mark>`
        // objWhere.name =   ( new RegExp(keyword, 'ig') ) ;
   
    try {         
        // ======================================================
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            // .find( objWhere )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')        
 
        let baivietSearch = await baivietModel        
        .find( objWhere )        
        // .find( {} )        
        .limit(12) 
        .sort({ updatedAt :  -1})                           
        .select ('tmain.name tmain.id  name title content fileUpload updatedAt seen')            
        // ======================================================
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false ,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu,                      
            baivietSearch             
            
        })
    } catch (error) {
        res.status(400).json({success: false  })
    }
 
 
}); 

module.exports = router;
