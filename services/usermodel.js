import gravatar from 'gravatar';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  contacts: [
    {
      name: {
        type: String,
        required: [true, 'Contact name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
      },
    }
  ],
  avatarURL: String, 
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});

userSchema.pre('save', function (next) {
  if (!this.avatarURL) {
    this.avatarURL = gravatar.url(this.email, { s: '250', d: 'retro' }, true);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
