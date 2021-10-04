const express = require('express');
const router 	= express.Router();
const chuyenmucModel= require(__path_models + '/chuyenmuc');
const myModel= require(__path_models + '/baiviet');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')
const uploadsHelpers  = require(__path_helpers + '/uploads')
let collection ='baiviet'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
let linkIndex       = '/'+systemConfig.prefixAdmin +`/${collection}/` ;
let folderUploads   = __path_uploads  +`/${collection}/` ;		
    
let pageTitleList= 'Quản lý Bài viết' ;
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
        let id	= paramsHelpers.getParam(req.params, 'id', '');   
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
    let dataGroup =  await chuyenmucModel.find({},{ _id : 1 , name : 1 });
        dataGroup.unshift({_id: 'Novalue', name: 'Chọn chuyên mục'});
    try {      
        if( id === '')  {  //add
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd  ,
                notify,
                data,                
                dataGroup,                
                message : req.flash('errors')
            })
        } else { //edit                        
            let data = await myModel.findById({_id :id})
                data.group_id   = data.tmain.id
                data.group_name = data.tmain.name
                res.render(`${folderView}form`,{
                    pageTitle: pageTitleEdit  ,
                    notify,
                    data,                    
                    dataGroup
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
    let dataGroup =  await chuyenmucModel.find({},{ _id : 1 , name : 1 });
            dataGroup.unshift({_id: 'Novalue', name: 'Chọn chuyên mục'});
    // VALIDATES
    //console.log(req.body.group_id);
     if(req.body.group_id =='Novalue' || req.body.name=='' ){
        //data.fileUpload = data.image_old ;        
        if ( req.file!= undefined && data.image_old !=='no_avatar.png')  // nếu có lỗi mà image đã vào thì xóa nó trong thư mục lưu			
            uploadsHelpers.removeFile(folderUploads , req.file.filename); 
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd ,            
                notify: {err: 'Có dữ liệu để trống. Hoặc không chọn Avatar ...'} ,
                data,
                dataGroup
        })
    }else{ // neeu VALIDATE OK
        try {
            if(typeof data !== 'undefined' && data !== undefined && data.id !==''){// EDIT  data.id laf type hidden          
                if(req.file == undefined){ //  sửa không có upload lại hình thì nó = hình cũ
                    data.fileUpload =  data.image_old; //gán lại hĩnh cũ - image_Old input hidden ben form edit
                }else if(data.image_old !=='no_avatar.png'){ // nếu có thay đổi hình mới thì xóa hình cũ nhưng nếu
                        uploadsHelpers.removeFile(folderUploads , data.image_old);  // xóa hình cũ
                        data.fileUpload = req.file.filename;  // đặt lại hình mới			
                }else{
                    data.fileUpload = req.file.filename;  // đặt lại hình mới			
                }
                //////////////////////////////////////////////////
                data.tmain ={    //tmain là collection của bảng baiviet
                    id 		: data.group_id,
                    name 	: data.group_name // group_name la input hidden trong form lấy dữ liệu từ file js
                }
                //////////////////////////////////////////////////
                await myModel.updateOne({_id: data.id} , data)                 
                res.redirect(linkIndex);
            } else {     // ADD               
                let checkExistsName = await myModel.findOne( { name: req.body.content})    // neeus baiviet ton tai            
                if(checkExistsName){
                    res.render(`${folderView}form`,{
                        pageTitle: pageTitleAdd ,
                        notify: {err: 'Đã tồn tại dữ liệu ...'}  ,
                        data,                        
                        dataGroup
                    } )
                }else{
                    data.tmain ={    //tmain là collection của bảng baiviet
                        id 		: data.group_id,
                        name 	: data.group_name  // group_name la input hidden trong form lấy dữ liệu từ file js
                        //slug    : data.group_name ,
                    }
                    if ( req.file == undefined || !req.file ){ // nếu không chọn thì lưu hình mặc định
                        data.fileUpload = 'no_avatar.png';
                    }else{
                        data.fileUpload =req.file.filename ; // file hình ảnh thay đổi theo nếu có thay đổi
                    }
                    await myModel.create(data) 
                    res.redirect(linkIndex);
                }
            }
        } catch (error) { 
            res.status(400).json({success: false})
        }
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