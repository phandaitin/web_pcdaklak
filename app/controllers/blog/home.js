const express = require('express');
const router 	= express.Router();


const videoModel     = require(__path_models + '/video');
const phuongthucvanhanhModel     = require(__path_models + '/phuongthucvanhanh');
const baivietModel= require(__path_models + '/baiviet');
const chuyenmucModel= require(__path_models + '/chuyenmuc');
// const systemConfig = require(__path_config + 'system');
 const paramsHelpers  = require(__path_helpers + '/params')
 let collection ='home'
 let folderView		=__path_views_blog  +`pages/${collection}/` ;
 let layoutBlog    = __path_views_blog + '/frontend';
   
  
// router.get('/(:id)?', async (req,res,next) => {     
router.get('/', async (req,res,next) => {     
    try {         
        //let idChuyenmuc	= paramsHelpers.getParam(req.params, 'id', '');       
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')

        let video = await videoModel
            .find( {} )          
            .limit(8)
            .sort({ updatedAt :  -1})                         
            .select ('name idvideo updatedAt')
        
        let phuongthucvanhanh ={};
        let lichdieudongxe ={};
        // let phuongthucvanhanh = await phuongthucvanhanhModel
        //     .find( {} )                   
        //     .limit(13) 
        //     .sort({ createdAt :  -1})
        //     .select ('name fileUpload updatedAt') 
        
        let baivietNew = await baivietModel
            .find( {status:'Active','tmain.name': {$ne:'Tin tiêu điểm'} } )    // khoong caans position       
            .limit(5) 
            .sort({ createdAt :  -1})
            .select ('tmain.name name title content status position fileUpload createdAt slug')
        
        let baivietTieudiem = await baivietModel
            .find( {status:'Active', 'tmain.name': 'Tin tiêu điểm'} )           
            .limit(4) 
            .sort({ updatedAt :  -1})
            .select ('tmain.name name title content seen fileUpload updatedAt slug')
            ////////////////////////////////////
        
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : true, banner :true, menu1 : false , menu:true ,
            chuyenmucMenu,
            video,
            baivietNew  ,
            baivietTieudiem  ,
            phuongthucvanhanh  ,
            lichdieudongxe
            
        })
    } catch (error) {
        res.status(400).json({success: false  })
    }
 
 
});
  
 
module.exports = router;