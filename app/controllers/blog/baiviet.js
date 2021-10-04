const express = require('express');
const router 	= express.Router();
const baivietModel= require(__path_models + '/baiviet');
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const paramsHelpers  = require(__path_helpers + '/params')
 let collection ='baiviet'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';

 router.get('/:id', async (req,res,next) => {     
    
    try {         
        let idBaiviet	= paramsHelpers.getParam(req.params, 'id', '');
        // ======================================================
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            // .find( objWhere )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')        

        let baivietCtiet = await baivietModel
            .findById( {status:'Active' ,  _id : idBaiviet} )                                   
            .select ('tmain.name tmain.id  name title content fileUpload updatedAt seen')            
            await baivietModel.updateOne({ _id:idBaiviet },{seen: parseInt(baivietCtiet.seen) +1} )

                               

        let baivietLienquan = await baivietModel
            .find( {status:'Active', _id: {$ne: idBaiviet} , 'tmain.id' : baivietCtiet.tmain.id  })    // phai thuộc chuyên mục liên quan       
            .limit(30) 
            .sort({ updatedAt :  -1})
            .select ('tmain.name name title content status position fileUpload updatedAt slug')
        // ======================================================
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false ,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu,                      
            baivietCtiet  ,
          
            baivietLienquan 
            
            
        })
    } catch (error) {
        res.status(400).json({success: false  })
    }
 
 
}); 

module.exports = router;