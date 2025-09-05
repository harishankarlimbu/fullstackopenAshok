import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, unique: true },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Instead of module.exports:
const User = mongoose.model('User', userSchema)
export default User