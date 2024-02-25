
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
  verifyEmail,
  resendVerificationEmail,
} from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', authMiddleware, logout);
userRouter.get('/current', authMiddleware, getCurrentUser);
userRouter.patch('/avatars', authMiddleware, updateUserAvatar);
userRouter.get('/verify/:verificationToken', verifyEmail);
userRouter.post('/verify', authMiddleware, resendVerificationEmail);


userRouter.get('/protected-route', authMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Protected route', user: req.user });
});

export default userRouter; 
