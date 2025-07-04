const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/mainController')
const passport = require('passport');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



function ensureLoggedIn(req,res,next){
    if (req.isAuthenticated()) return next();
    res.redirect('/')

}
function logout(req,res,next){
  req.logout((err)=>{
    if (err) return next(err)
    res.redirect('/')
  });
}

router.get('/',controllers.home)

router.post('/signup',controllers.signUp)
router.post('/login',passport.authenticate('local', {
  successRedirect: '/createFolder',
  failureRedirect: '/',
}))

router.get('/upload',ensureLoggedIn,controllers.uploadPage)
router.post('/upload',ensureLoggedIn,upload.single('file'),controllers.uploadFile)
router.get('/logout',logout)

// View folder
router.get('/viewFolders',ensureLoggedIn,controllers.viewFolders)
router.get('/viewFolders/:folderId',ensureLoggedIn,controllers.viewFolderFiles)

// Create Folder
router.get('/createFolder',ensureLoggedIn,controllers.createFolder)
router.post('/createFolder',ensureLoggedIn,controllers.createFolderPost)

// // Remove Folder
router.post('/remove/:id',ensureLoggedIn,controllers.removeFolder)

// Update Folder
router.post('/update/:id',ensureLoggedIn,controllers.updateFolder)

// View File
router.get('/files/:id/download', controllers.downloadFile);


module.exports=router