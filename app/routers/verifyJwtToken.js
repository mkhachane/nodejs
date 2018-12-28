const jwt = require('jsonwebtoken');
const Config = require('../config/config.js');
const User = require('../models/userModel.js');
const Role = require('../models/roleModel.js');


//-> Checking a JWT token is valid or not
/* Input:
*	Token
*  Output:
*     data of user
*/
verifyToken = (req, res, next) => {
	let token = req.headers['access-token'];
	if (!token){
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
	}
	jwt.verify(token, Config.secret, (err, decoded) => {
		if (err){
			return res.status(500).send({ 
					auth: false, 
					message: 'Fail to Authentication. Error -> ' + err 
				});
		}
		req.userId = decoded.id;
		next();
	});
}
 
//-> Checking an User has ADMIN role or NOT
isAdmin = (req, res, next) => {
	User.findOne({ _id: req.userId })
	.exec((err, user) => {
		if (err){
			return res.status(500).send({
				message: "Error retrieving User with Username = " + req.body.username
			});
		}
		Role.find({
			'_id': { $in: user.roles }
		}, (err, roles) => {
			if(err) 
				res.status(500).send("Error -> " + err);
 
			for(let i=0; i<roles.length; i++){
				if(roles[i].name.toUpperCase() === "ADMIN"){
					next();
					return;
				}
			}
			res.status(403).send("It is require for only Admin Role!");
		});
	}); 
}
 

//-> Checking an User has SUPERUSER and ADMIN role or NOT
isSuperuserOrAdmin = (req, res, next) => {
	User.findOne({ _id: req.userId })
	.exec((err, user) => {
		if (err){
			return res.status(500).send({
				message: "Error retrieving User with Username = " + req.body.username
			});
		}
		Role.find({
			'_id': { $in: user.roles }
		}, (err, roles) => {
			if(err) 
				res.status(500).send("Error -> " + err);
 
			for(let i=0; i<roles.length; i++){
				let role = roles[i].name.toUpperCase();
				if(role === "SUPERUSER" || role === "ADMIN"){
					next();
					return;
				}
			}
			res.status(403).send("It is require SUPERUSER or Admin Only!");
		});
	});
}
 
const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isSuperuserOrAdmin = isSuperuserOrAdmin;
 
module.exports = authJwt;