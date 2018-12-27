const config  = require('../config/config.js');
const ROLEs = config.ROLEs;
const User = require('../models/userModel');

// Checks the Username and Email is already taken or not
checkDuplicateUserNameOrEmail = (req, res, next) => {
      User.findOne({ username: req.body.username})
      .exec((err, user)=> {
            if(err){
                  res.status(500).send({
                        message: "Error retrieving User with Username = " + req.body.username
                  });
            }
            if(user){
                  res.status(400).send("Fail -> Username is already taken!");
            }
            User.findOne({ email: req.body.email })
		.exec((err, user) => {
			if (err){
				res.status(500).send({
					message: "Error retrieving User with Email = " + req.body.email
				});                
			}
			if(user){
				res.status(400).send("Fail -> Email is already in use!");
			}
			next();
		});
      }); 

}

checkRolesExisted = (req, res, next) => {
      for(let i =0; i<req.body.length; i++){
            if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
                  res.status(400).send("Fail -> Does NOT exist Role = "+ req.body.roles[i]);
            }
      }
      next();
}

const signUpVarify = {};
signUpVarify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVarify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVarify;