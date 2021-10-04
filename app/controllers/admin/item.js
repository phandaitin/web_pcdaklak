const express = require('express');
const router 	= express.Router();
const myModel= require(__path_models + '/item');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')
let collection ='item'
let folderView		=__path_views_admin  +`pages/${collection}/` ;
let linkIndex       = '/'+systemConfig.prefixAdmin +`/${collection}/` ;

let pageTitleList='Quản lý chuyên mục';
let pageTitleAdd    =pageTitleList + ' - thêm';
let pageTitleEdit   =pageTitleList + ' - cập nhật';
// List users
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
            totalRowsPerPage: 10,
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
        await myModel.deleteOne({ _id:id } ) 
            req.flash('errors', 'Xóa thành công !!!') ;    
            res.redirect(linkIndex);    
    } catch (error) {
        res.status(400).json({success: false  })
    }	 
});


// GET CHO ADD - EDIT 
router.get(('/form(/:id)?'),  async (req, res, next) => {
    let data    = {} ;
    let id      = paramsHelpers.getParam(req.params, 'id', '');                           
    
    try {      
        if( id === '')  {  //add
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd  ,
                data
                ,message : req.flash('errors')
            })
        } else { //edit
            let data = await myModel.findById({_id :id})
            res.render(`${folderView}form`,{
                pageTitle: pageTitleEdit  ,
                data
            })
        }   
    }catch (error) {   //        
        res.status(400).json({success: false})                  
    };

});

               
    
    //res.render(`${folderView}list`)
    // req.body = JSON.parse(JSON.stringify(req.body));
	// let data = Object.assign(req.body);	
    // console.log(data);
  
// POST xử lý cho cả 2 TH add và edit
router.post( ('/save'), async (req,res,next) => {     // xử lý cho cả 2 TH add và edit
    try {          
        let id = paramsHelpers.getParam(req.params, 'id', '');                           
        data = Object.assign(req.body);
        if(typeof data !== 'undefined' && data.id !==''){// EDIT                
            await myModel.updateOne({_id: data.id} , data) 
            res.redirect(linkIndex);
        } else { // neu ADD tiep tucj kiem tra da ton tai 
            let group = await myModel.findOne( { name: req.body.name})                
            if(group){
                res.render(`${folderView}form`,{pageTitle: pageTitleAdd ,data: {err: 'Item Exit'} } )
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