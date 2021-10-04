const express = require('express');
const router 	= express.Router();

const myModel= require(__path_models + '/video');
const systemConfig = require(__path_config + 'system');
const paramsHelpers  = require(__path_helpers + '/params')

let collection ='video'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
let linkIndex       = '/'+systemConfig.prefixAdmin +`/${collection}/` ;
    
let pageTitleList= 'Cập nhật Video' ;
let pageTitleAdd    =pageTitleList + ' - thêm';
let pageTitleEdit   =pageTitleList + ' - cập nhật';
//============================================================= 
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
            totalRows		 :  await myModel.countDocuments({objWhere})  ,
            totalRowsPerPage: 5,
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
router.post( ('/save'),  async (req,res,next) => {          
    req.body = JSON.parse(JSON.stringify(req.body));                     
    let data = Object.assign(req.body);
    // VALIDATES    
     if(1==2){
            res.render(`${folderView}form`,{
                pageTitle: pageTitleAdd ,            
                notify: {err: 'Có lỗi...'} ,
                data
        })
    }else{ // neeu VALIDATE OK
        try {
            if(typeof data !== 'undefined' && data !== undefined && data.id !==''){// EDIT 
                await myModel.updateOne({_id: data.id} , data)                 
                res.redirect(linkIndex);
            } else {     // ADD   
                    await myModel.create(data) 
                    res.redirect(linkIndex);
            }
        } catch (error) { 
            res.status(400).json({data: error})
        }
    }
 });

 
  
module.exports = router;