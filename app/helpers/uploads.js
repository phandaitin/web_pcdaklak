const multer  = require('multer');
const path = require('path');
const fs    = require('fs'); 
//let uploadFile = (field, folderDes = 'users', fileNameLength = 10, fileSizeMb = 1, fileExtension = 'jpeg|jpg|png|gif') => {

let uploadFile = (fileUpload, folderDes) => {
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, __path_uploads + '/' + folderDes + '/')
		},
		filename: (req, file, cb) =>  {
			cb(null, Date.now() +'_'+file.originalname );
		}
	});

	const upload = multer({ 
		storage: storage,
		limits: {
			fileSize: 2 * 1024 * 1024,
		},
		fileFilter: (req, file, cb) => {		
			const filetypes = new RegExp('jpeg|jpg|png|gif|pdf|doc');
			const extname 	= filetypes.test(path.extname(file.originalname).toLowerCase());
			const mimetype  = filetypes.test(file.mimetype);
	
			if(mimetype && extname){
				return cb(null,true);
			}else {
                cb(new Error('File có phần mở rộng không đúng. Hoặc quá 2 Mb !!!'))
			}			
		}
	}).single(fileUpload);
	return upload;
}

let removeFile = (folder, fileName) => {
	if(fileName != '' && fileName != undefined ){
		let path = folder + fileName;
		if (fs.existsSync(path))  
        	fs.unlink(path, (err) => {
            	if (err) throw err;
        	});
	}
}

module.exports = {
	uploadFile: uploadFile ,
	removeFile: removeFile
}