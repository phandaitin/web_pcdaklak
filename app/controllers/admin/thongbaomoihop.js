const express = require('express');
const router 	= express.Router();
const groupModel= require(__path_models + '/group');
const myModel= require(__path_models + '/thongbaomoihop');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')
const uploadsHelpers  = require(__path_helpers + '/uploads')
let collection ='thongbaomoihop'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
let linkIndex       = '/'+systemConfig.prefixAdmin +`/${collection}/` ;
let folderUploads   = __path_uploads  +`/${collection}/` ;		
    
let pageTitleList= 'Thông báo mời họp' ;
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
        if ( data.fileUpload !=='no_avatar.png'){
            uploadsHelpers.removeFile(folderUploads, data.fileUpload)  // xoa luon hinh anh
        }
        await myModel.deleteOne({ _id:id } )         
            req.flash('errors', 'Xóa thành công !!!') ;    
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
                notify,
                data,                
                            
                message : req.flash('errors')
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
router.post( ('/save'),  uploadsHelpers.uploadFile('fileUpload', collection), async (req,res,next) => {      
    req.body = JSON.parse(JSON.stringify(req.body));                     
    let data = Object.assign(req.body);
    // VALIDATES
    //console.log(req.body.group_id);
     if(1==2 ){        
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd ,            
                notify: {err: 'Có lỗi...'} ,
                data
        })
    }else{ // neeu VALIDATE OK
        try {
            if(typeof data !== 'undefined' && data !== undefined && data.id !==''){// EDIT  data.id laf type hidden          
               await myModel.updateOne({_id: data.id} , data)                 
                res.redirect(linkIndex);
            } else {     // ADD               
                    data.fileUpload =req.file.filename
                    await myModel.create(data) 
                    res.redirect(linkIndex);
                
            }
        } catch (error) { 
            res.status(400).json({success: false})
        }
    }
 });

 
  

module.exports = router;