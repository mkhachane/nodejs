var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const Role = require('./app/models/roleModel.js');
const user = require('./app/routers/router.js');

// Configuring the database
const config = require('./app/config/config.js');
const mongoose = require('mongoose');

app.use(bodyParser.json())
app.use('/user', user )

// mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(config.url)
.then(() => {
	console.log("Successfully connected to MongoDB.");    
	initial();
}).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();	
});
 
// Create a Server
app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
})
 
 
function initial(){
	Role.count( (err, count) => {
		if(!err && count === 0) {
			// USER Role ->
			new Role({
				name: 'USER'
			}).save( err => {
				if(err) return console.error(err.stack)
				console.log("USER_ROLE is added")
			});
 
			// ADMIN Role ->
			new Role({
				name: 'ADMIN'
			}).save( err => {
				if(err) return console.error(err.stack)
				console.log("ADMIN_ROLE is added")
			});
 
			// SUPERUSER Role ->
			new Role({
				name: 'SUPERUSER'
			}).save(err => {
				if(err) return console.error(err.stack)
				console.log("SUPERUSER_ROLE is added")
			});
		}
	});
}