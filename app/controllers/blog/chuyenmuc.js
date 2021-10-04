const express = require('express');
const router 	= express.Router();
const baivietModel= require(__path_models + '/baiviet');
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const kdoanhModel= require(__path_models + '/kdoanh');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')
const collection ='chuyenmuc'
const folderView	= __path_views_blog  +`pages/${collection}/` ;
const layoutBlog    = __path_views_blog + '/frontend';
   
 
//router.get('/', async (req,res,next) => {     
// router.get( '/(:id)?' , async (req,res,next) => {    
router.get( '/' , async (req,res,next) => {    
    try {                         
        //let idChuyenmuc	= paramsHelpers.getParam(req.params, 'id', '');            
        let chuyenmucMenu = await chuyenmucModel
            .find( {status:'Active'}  )    // khoong caans position                   
            .sort({ order  :  'asc'})
            .select ('name slug')
        let baivietRandom= await baivietModel.aggregate([
            { $match: { status: 'Active' }},
            { $project : {_id: 1 ,name : 1 , title :1 , content:1 , seen:1 , updatedAt : 1 , fileUpload: 1}  },                        
            { $sample: {size: 3}}
        ])
        
        let kdoanh = await kdoanhModel
            .find( {} )                           
            .sort({ name  :  'asc'})            
            .select ('name khang tpham updatedAt')

        // -----------------------------------------------------------            
        let   baivietKythuat = await baivietModel
        .find( {status:'Active', 'tmain.id': '613dca9318bba8e1d4a7aead' } )           
        .limit(3) 
        .sort({ updatedAt :  -1})
        .select ('tmain.id tmain.name name title content seen fileUpload updatedAt slug')                

        let    baivietKinhdoanh = await baivietModel
       .find( {status:'Active', 'tmain.id': '613dca8918bba8e1d4a7aea6'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt slug')        

       let    baivietChuyendoiso = await baivietModel
       .find( {status:'Active', 'tmain.id': '6149f7da060c5cb5d0e14301'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt')               

    let  baivietNhanvatsukien = await baivietModel
       .find( {status:'Active', 'tmain.id': '613dcb35bbc038d73e5dd6d7'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ')        
    
       let  baivietDangdoanthe = await baivietModel
       .find( {status:'Active', 'tmain.id': '613dcab718bba8e1d4a7aeb4'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ') 
    
    let  baivietCongdoan = await baivietModel
       .find( {status:'Active', 'tmain.id': '6149f7ba060c5cb5d0e142e8'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ') 
       
    let  baivietVHDN_TrianKH = await baivietModel
       .find( {status:'Active', 'tmain.id': '61404ea3ed1bf61da40165c9'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ') 
    
    let  baivietDoanCS = await baivietModel
       .find( {status:'Active', 'tmain.id': '614a8855157352a20653ce2b'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ') 
    
    let  baivietThovan = await baivietModel
       .find( {status:'Active', 'tmain.id': '6149f7a6060c5cb5d0e142d7'} )           
       .limit(3) 
       .sort({ updatedAt :  -1})
       .select ('tmain.id tmain.name name title content seen fileUpload updatedAt ')

   
    //-----------------------------------------------------------
        ////////////////////////////////////
        res.render(`${folderView}index`,{                        
            layout: layoutBlog  , preloader : false  ,  banner : false, menu : false , menu1:true ,
            chuyenmucMenu ,
            baivietRandom,    
            baivietKinhdoanh,      
            baivietKythuat , 
            baivietChuyendoiso ,             
            baivietNhanvatsukien,
            baivietDangdoanthe,    
            baivietCongdoan,

            baivietVHDN_TrianKH,
            baivietDoanCS,
            baivietThovan ,
           
            kdoanh 

        })
    } catch (error) {
        res.status(400).json({success:false})
    }
 
});



module.exports = router;