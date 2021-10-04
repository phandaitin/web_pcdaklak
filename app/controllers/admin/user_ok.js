const express = require('express');
const router 	= express.Router();
const myModel= require(__path_models + '/user_ok');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')
const user_okValidates  = require(__path_validates + '/user_ok')
let collection ='user_ok'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
let linkIndex       = '/'+systemConfig.prefixAdmin +`/${collection}/` ;
    
let pageTitleList= 'Quản lý user_ok' ;
let pageTitleAdd    =pageTitleList + ' - thêm';
let pageTitleEdit   =pageTitleList + ' - cập nhật';
// List user_oks
//router.get('(/items/:id)?', async (req,res,next) => {     
router.get('/', async (req,res,next) => {     
    try { 
        let objWhere    = {};
        let keyword     =  paramsHelpers.getParam(req.query, 'keyword', '');
        if(keyword !== '') objWhere.name = new RegExp(keyword, 'ig');
 
        let sortField 		=  paramsHelpers.getParam(req.session, 'sort_field', 'createdAt'); 
        let sortType		=  paramsHelpers.getParam(req.session, 'sort_type', 'desc'); 
        let sort ={};
        sort[sortField]= sortType;

        pagination 	 = {
            totalRows		 : await myModel.countDocuments({objWhere})  ,
            totalRowsPerPage: 2,
            currentPage		 : parseInt(paramsHelpers.getParam(req.query, 'page', 1)),
            pageRanges		 : 3
        };
        await myModel.count({objWhere}).then( (zdata) => {
           pagination.totalRows = zdata;
        });


        let data = await myModel
            .find(objWhere)   
            .sort(sort)
            .skip((pagination.currentPage-1) * pagination.totalRowsPerPage)
		    .limit(pagination.totalRowsPerPage)
            res.render(`${folderView}list`,{                        //  res.status(200).json({
            pageTitle: pageTitleList ,  message : req.flash('errors') ,
            data ,
            pagination,
            keyword ,
            sortField,
            sortType
           
        })
    } catch (error) {
        res.status(400).json({success: false  })
    }
});

 
 // DELETE ONE
router.get('/delete/:id/', async (req, res, next) => {
    try {
        let id				= paramsHelpers.getParam(req.params, 'id', '');   
        let data = await myModel.findById({_id :id})
        await myModel.deleteOne({ _id:id } )         
            req.flash('errors', 'Xóa user_ok thành công !!!') ;    
            res.redirect(linkIndex);    
    } catch (error) {
        res.status(400).json({success: false  })
    }	 
});


// GET CHO ADD - EDIT 
router.get(('/form(/:id)?'),  async (req, res, next) => {
    let id      = paramsHelpers.getParam(req.params, 'id', '');                           
    let data    = {} ;
    let notify  = {};
    try {      
        if( id === '')  {  //add
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd  ,
                notify: req.flash('err'),
                data 
            })
        } else { //edit                        
            let data = await myModel.findById({_id :id})
                res.render(`${folderView}form`,{
                    pageTitle: pageTitleEdit  ,
                    notify,
                    data
            })
        }   
    }catch (error) {   //        
        res.status(400).json({success: false})                  
    };

});
   
// POST xử lý cho cả 2 TH add và edit
router.post( ('/save'), user_okValidates, async (req,res,next) => {      
    req.body = JSON.parse(JSON.stringify(req.body));                     
    let data = Object.assign(req.body);
        try {
            if(typeof data !== 'undefined' && data !== undefined && data.id !==''){// EDIT  data.id laf type hidden          
                await myModel.updateOne({_id: data.id} , data)                 
                res.redirect(linkIndex);
            } else {     // ADD               
              //  let checkExistsName = await myModel.findOne( { name: req.body.name})    // neeus user_ok ton tai            
                if(1==2){
                    // if(checkExistsName){
                    // res.render(`${folderView}form`,{
                    //     pageTitle: pageTitleAdd ,
                    //     notify: {err: 'Đã tồn tại dữ liệu ...'}  ,
                    //     data 
                    // } )
                }else{                    
                    await myModel.create(data) 
                    res.redirect(linkIndex);
                }
            }
        } catch (error) { 
            res.status(400).json({success: false})
        }
 });

 
 
// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
    req.session.sort_field 		=  paramsHelpers.getParam(req.params, 'sort_field', 'createdAt'); 
    req.session.sort_type		=  paramsHelpers.getParam(req.params, 'sort_type', 'desc'); 
    res.redirect(linkIndex);
});

// Change status
router.get('/change-status/:id/:status', async (req, res, next) => {
    try {
        let currentStatus	= paramsHelpers.getParam(req.params, 'status', 'Active'); 
        let status			= (currentStatus === "Active") ? "Inactive" : "Active";
        let id				= paramsHelpers.getParam(req.params, 'id', '');                 
        await myModel.updateOne({ _id:id} ,{ status: status } )             
            req.flash('errors',  'Cập nhật  trạng thái thành công !!!') ;            
            res.redirect(linkIndex)          
    } catch (error) {
        req.flash('errors', 'False !!!') ;
        res.status(400).json({success: false  })
    }	 
});
 
// Change position ok
router.get('/change-position/:id/:position', async (req, res, next) => {
    try {
        let currentPosition    	= paramsHelpers.getParam(req.params, 'position', 'Top'); 
        let position			= (currentPosition === 'Top') ? 'None' : 'Top';
        let id				= paramsHelpers.getParam(req.params, 'id', ''); 
            
        await myModel.updateOne({ _id:id } ,{ position: position } ) 
            req.flash('errors', 'Cập nhật vị trí bài viết thành công !!!') ;
            res.redirect(linkIndex);    
    } catch (error) {
        req.flash('errors', 'False !!!') ;
        res.status(400).json({success: false  })
    }	 
});
 
// Change radio ok
router.get('/change-radio/:id/:radio', async (req, res, next) => {
    try {
        let currentRadio    	= paramsHelpers.getParam(req.params, 'radio', 'true'); 
        let radio			= (currentRadio === 'true') ? 'false' : 'true'  ;
        let id				= paramsHelpers.getParam(req.params, 'id', ''); 
            
        await myModel.updateOne({ _id:id } ,{ radio: radio } ) 
            req.flash('errors', 'Cập nhật Radio thành công !!!') ;
            res.redirect(linkIndex);    
    } catch (error) {
        req.flash('errors', 'False !!!') ;
        res.status(400).json({success: false  })
    }	 
});


// router.get('/(:id?)', async (req,res,next) => { 
//     try {
//         let id      =   req.params.id;
//         let data    =   await myModel.find({_id :id})   // nếu findById thì tiếp theo là callback
//         res.render(`${folderView}list`,{
//              pageTitle: pageTitleList , 
//              success: true,
//              data          
//          })
//     } catch (error) {
//         res.status(400).json({ success: false })                
//     }    
//  });


 




module.exports = router;