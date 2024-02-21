import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../services/usermodel.js';
import Joi from 'joi';
import jimp from 'jimp';
import path from 'path';

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      subscription: 'starter',
    });

    await newUser.save();

    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ userId: user._id }, 'shhhhh', { expiresIn: '1h' });

    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    user.token = null; 
    await user.save();

    return res.status(204).json(); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCurrentUser = (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

const updateUserAvatar = async (req, res) => {
  try {
    const { file } = req;
    const { user } = req; 

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarBuffer = await jimp.read(file.buffer);
    await avatarBuffer.resize(250, 250).writeAsync(path.join(__dirname, '..', 'tmp', `${user._id}.jpg`));

    const avatarFileName = `${user._id}-${Date.now()}.jpg`;
    await avatarBuffer.writeAsync(path.join(__dirname, '..', 'public', 'avatars', avatarFileName));

    user.avatarURL = `/avatars/${avatarFileName}`;
    await user.save();

    return res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
};