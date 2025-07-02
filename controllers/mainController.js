
const { body, validationResult } = require("express-validator");
const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')


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


exports.home = (req,res)=>{
	res.render('index',{
	    errors:{}
	})
}

exports.uploadPage = (req,res)=>{
	res.render('upload',{
	    errors:{}
	})
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
			const formData = req.body;
			const hashedPassword = await bcrypt.hash(req.body.password,10)
			formData.password = hashedPassword;
			await prisma.user.create({
				data:{
					email: formData.email,
					password: formData.password
				}
			})
			// REDIRECT TO OTHER ROUTE:
     		res.redirect('/upload')
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Signing up");
		}

	}
]