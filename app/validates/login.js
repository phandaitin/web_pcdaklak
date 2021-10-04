const bcrypt = require('bcrypt');
const myModel= require(__path_models + '/user_ok');
const systemConfig = require(__path_config + 'system');
let collection ='auth'
let folderView		  = __path_views_admin  +`pages/${collection}/` ;
let layoutLogin     = __path_views_admin  + 'login';
let linkDashboard   =    '/'+systemConfig.prefixAdmin  ;

module.exports =  async  (req, res, next) => {    
    let data = Object.assign(req.body); 
    
    if(data.user =='' || data.user == null){
        return  res.render(`${folderView}login`,{
              layout : layoutLogin,
              data,                   
              notify: {err: 'User không được trống...'}              
          } )
      }
      if(data.pass =='' || data.pass == null){
        return  res.render(`${folderView}login`,{
              layout : layoutLogin,
              data,     
              notify: {err: 'Password không được trống...'}              
          } )
      }
    //--------------------------------------------------------    
      let userr = await myModel.findOne( { user: data.user } )  
        if(userr){
            const match =  await bcrypt.compare( data.pass , userr.pass) ;
            if(match){
                req.session.userID = userr._id                
                return res.redirect(linkDashboard)
            }else{
                return  res.render(`${folderView}login`,{
                layout : layoutLogin,
                data ,
                notify: {err: 'User hoặc or password không khớp...'}              
                })
            }
        }
        
      next();
 
}
 