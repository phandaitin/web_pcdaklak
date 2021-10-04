const myModel= require(__path_models + '/user_ok');
let collection ='user_ok'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
module.exports =  async (req, res, next) => {
    
    let data = Object.assign(req.body);
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;    
    if(!req.body.email.match(emailRegex) ){   
        return res.render(`${folderView}form`,{
            data,
            pageTitle: 'Quản trị Email'  ,                                
            //req.flash('err', 'Email định dạng không đúng...') 
            notify: {err: 'Email không hợp lệ ...'}
        })
    }
    let checkExistsUser = await  myModel.findOne( { user: data.user })             
    if(checkExistsUser){
      return  res.render(`${folderView}form`,{
            data,     
            pageTitle: 'Quản trị User' ,
            notify: {err: 'User đã tồn tại dữ liệu ...'}              
        } )
    }
    if(data.user =='' || data.user == null){
        return  res.render(`${folderView}form`,{
              data,     
              pageTitle: 'Quản trị User' ,
              notify: {err: 'User không được trống...'}              
          } )
      }
      if(data.role =='' || data.role == null){
        return  res.render(`${folderView}form`,{
              data,     
              pageTitle: 'Quản trị Role' ,
              notify: {err: 'Role không được trống...'}              
          } )
      }
    //--------------------------------------------------------
    next()
  }
  