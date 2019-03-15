const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserSchema = new Schema({
    name: String,
    age: Number,
    sex: String,
    email: String
})

module.exports = mongoose.model('User', UserSchema);