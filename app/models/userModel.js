const Role = require('./roleModel.js');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
      name: String,
      username: String,
      password: String,
      roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
});


module.exports = mongoose.model('User', UserSchema);