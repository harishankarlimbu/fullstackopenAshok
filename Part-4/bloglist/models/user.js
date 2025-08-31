const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: String,
    passwordHash: { type: String, required: true },
  
})
userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', userSchema)