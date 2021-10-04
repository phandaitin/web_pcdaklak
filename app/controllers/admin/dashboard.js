const express = require('express');
const router 	= express.Router();


let collection ='dashboard'
let folderView		= __path_views_admin  +`pages/${collection}/` ;
    
let pageTitleList= 'WELLCOME !!!' ;
//===================================
router.get('/',   (req,res,next) => {         
            res.render(`${folderView}index`,{          
            pageTitle: pageTitleList  
        }) 
});

  
  
module.exports = router;