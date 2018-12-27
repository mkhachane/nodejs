const config = require('../config/config.js');
const User   = require('../models/userModel.js');
const Role   = require('../models/roleModel.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


//-> Save User into the database
exports.signup = (req, res)=> {
      console.log("Processing func -> SignUp");

      const user = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
      });

      // Save a User to the MongoDB
    user.save().then(savedUser => {
		Role.find({
				'name': { $in: req.body.roles.map(role => role.toUpperCase()) }
		}, (err, roles) => {
			console.log(roles)
			if(err) 
				res.status(500).send("Error -> " + err);
 
			// update User with Roles
			savedUser.roles = roles.map(role => role._id);
			savedUser.save(function (err) {
				if (err) 
					res.status(500).send("Error -> " + err);
 
				res.send("User registered successfully!");
			});
		});
    }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
    });
}


//-> Display username and token for further use
/* Input:
*     username
*     password
*  Output:
*     access_token
*/
exports.signin = (req, res) => {
	console.log("Sign-In");
      User.findOne({ username: req.body.username })
      .exec()
      .then(function(user){
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		var token = jwt.sign({ id: user._id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ auth: true, accessToken: token });
      })
      .catch(err => {
            res.status(401).send("Username not found -> " + req.body.username)
      });
}

//-> Shows user role content
/* Input:
*     token
*  Output:
*     content of user
*/
exports.userContent = (req, res) => {
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			return res.status(500).send({
				message: "Error retrieving User with _id = " + req.userId	
			});
		}
		res.status(200).json({
			"description": "User Content Page",
			"user": user
		});
	});
}
 
//-> Shows ADMIN role content
/* Input:
*     token
*  Output:
*     content of ADMIN
*/
exports.adminBoard = (req, res) => {
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			res.status(500).json({
				"description": "Can not access Admin Board",
				"error": err
			});
			return;
		}		
		res.status(200).json({
			"description": "Admin Board",
			"user": user
		});
	});
}
 
//-> Shows SUPERUSER role content
/* Input:
*     token
*  Output:
*     content of SUPERUSER
*/
exports.managementBoard = (req, res) => {
	User.findOne({ _id: req.userId })
	.select('-_id -__v -password')
	.populate('roles', '-_id -__v')
	.exec((err, user) => {
		if (err){
			res.status(500).json({
				"description": "Can not access SUPERUSER Board",
				"error": err
			});
			return;
		}		
		res.status(200).json({
			"description": "SUPERUSER Board",	
			"user": user
		});
	});
}