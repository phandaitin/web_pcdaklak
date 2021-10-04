
const groupModel= require(__path_models + '/group');
const myModel= require(__path_models + '/user');
let collection ='user'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
module.exports =   (req, res, next) => {
    let data = Object.assign(req.body);
    let dataGroup =  {}
    let checkExistsName =   myModel.findOne( { name: data.name})             
    if(checkExistsName){
      return  res.render(`${folderView}form`,{
            pageTitle: 'Quản lý User - Thêm' ,
            notify: {err: 'User đã tồn tại dữ liệu ...'}  ,
            data,                        
            dataGroup
        } )
    } 
    next()
  }


 