const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/mainController')

function ensureLoggedIn(req,res,next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login')

}

router.get('/',controllers.home)

router.post('/signup',controllers.signUp)
// router.post('/login',controllers.home)

router.get('/upload',ensureLoggedIn,controllers.uploadPage)
// router.post('/upload',controllers.uploadPost)




module.exports=router