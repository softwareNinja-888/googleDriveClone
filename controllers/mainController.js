const { body, validationResult } = require("express-validator");
const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')
const passport = require('passport');

const path = require('path');
const fs = require('fs');


const validateUser = [
  // Email
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  // Password
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const validateFolder = [
	 // First Name
  body('folder')
    .isLength({ min: 2, max: 50 })
    .withMessage('Folder name should be at least 2 characters and not more than 50')
    .matches(/^[\w\s\-\/&()]+$/)
    .withMessage('Special characters are not allowed. Use only letters, numbers, spaces, and - / & ( )')
    .trim()
    .escape(),
]


exports.home = (req,res)=>{
	res.render('index',{
	    errors:{}
	})
}

exports.uploadPage = async (req,res)=>{

	try{
		// FIND FOLDER FROM USER:
		const folders = await prisma.folder.findMany({
			where: {
				userId: req.user.id
			}
		})
		res.render('upload',{
		    errors:{},
		    folders:folders
		})
	} catch(err){
		console.error('Error fetching folders',err)
		res.status(500).send(err)
	}
}

exports.uploadFile = async (req, res) => {
  try {
    const fileInfo = req.file;

    if (!fileInfo) {
      return res.status(400).send("No file uploaded");
    }
    
    const createdFile = await prisma.file.create({
      data: {
        name: fileInfo.originalname,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype,
        uploadPath: fileInfo.path,
        folderId: Number(req.body.folderId),
      }
    });

    res.redirect(`/viewFolders`);
  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).send(err.message || err);
  }
};

exports.viewFolders = async (req,res)=>{
	try{
		// FIND FOLDER FROM USER:
		const folders = await prisma.folder.findMany({
			where: {
				userId: req.user.id
			}
		})

		res.render('viewFolders',{
		    errors:{},
		    folders:folders
		})
	} catch(err){
		console.error('Error fetching folders',err)
		res.status(500).send(err)
	}
}


exports.viewFolderFiles = async (req,res)=>{
	try{
		const files = await prisma.file.findMany({
			where: {
				folderId: Number(req.params.folderId),
			}
		})

		res.render('viewFile',{
		    errors:{},
		    files:files
		})
	} catch(err){
		console.error('Error fetching folders',err)
		res.status(500).send(err)
	}
}


exports.downloadFile = async (req,res)=>{
	 try {
    const fileId = parseInt(req.params.id);
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    console.log('file:',file)

    if (!file) return res.status(404).send('File not found');

    const filePath = path.join(__dirname, '..', file.uploadPath);

    console.log('Name:',filePath)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found on disk');
    }

    res.download(filePath, file.name); // sends with original name
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.createFolder = (req,res)=>{
	res.render('createFolder')
}

exports.createFolderPost = [
	validateFolder,
	async (req, res) => {
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			return res.status(400).render('index',{
				errors: errors.array(),
				oldInput:req.body
			})
		}
	  try {
	  	const folder = await prisma.folder.create({
	  		data:{
	  			name: req.body.folder,
	  			userId: req.user.id
	  		}
	  	})
	  	res.redirect('/viewFolders')
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Creating folder");
		}

	}
]



exports.updateFolder = async (req, res) => {
	  try {
	  	const {id} = req.params

	  	const folder = await prisma.folder.update({
	  		where :{
	  			id: Number(id)
	  		},
	  		data:{
	  			name: req.body.folderName
	  		}
	  	})
	  	res.redirect('/viewFolders')
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Updatingfolder");
		}

}


exports.removeFolder = async (req, res) => {
	  try {
	  	const {id} = req.params
	  	const folder = await prisma.folder.delete({
	  		where :{
	  			id: Number(id)
	  		}
	  	})

	  	res.redirect('/viewFolders')
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Deleting folder");
		}

	}

exports.signUp  =  [
	validateUser,
	async (req, res) => {
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			return res.status(400).render('index',{
				errors: errors.array(),
				oldInput:req.body
			})
		}
	  try {
	  	// TODO:IMPLEMENT FUNC:
	  	const {email,password } = req.body
		  const existingUser = await prisma.user.findUnique({ where: {email } });
	    if (existingUser) {
	      return res.status(400).send('User already exists');
	    }
			const formData = req.body;
			const hashedPassword = await bcrypt.hash(req.body.password,10)
			formData.password = hashedPassword;
			const user = await prisma.user.create({
				data:{
					email: formData.email,
					password: formData.password
				}
			})
			// REDIRECT TO OTHER ROUTE:
			req.login(user,(err)=>{
				if (err){
			    console.error('Login error:', err);
			    return res.status(500).send('Could not log in after signup');
			  }
				res.redirect('upload')
			})
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Signing up");
		}

	}
]