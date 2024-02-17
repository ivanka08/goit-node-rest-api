
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  register,
  login,
  logout,
  getCurrentUser,
} from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post('/users/register', register);
userRouter.post('/users/login', login);
userRouter.post('/users/logout', logout);
userRouter.get('/users/current', getCurrentUser);

userRouter.get('/protected-route', authMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Protected route', user: req.user });
});

export default userRouter; 
