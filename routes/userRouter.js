const express = require('express');
const authMiddleware = require('./middlewares/authMiddleware');
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require('./controllers/user');

const router = express.Router();

userRouter.post('/users/register', register);
userRouter.post('/users/login', login);
userRouter.post('/users/logout', logout);
userRouter.get('/users/current', getCurrentUser);

router.get('/protected-route', authMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Protected route', user: req.user });
});

module.exports = userRouter;