const { Router } = require('express')
const router = Router()
const controllers = require('../controllers/mainController')
const passport = require('passport');


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
  successRedirect: '/upload',
  failureRedirect: '/',
}))

router.get('/upload',ensureLoggedIn,controllers.uploadPage)
router.get('/logout',logout)




module.exports=router