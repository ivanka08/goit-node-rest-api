
const jwt = require('jsonwebtoken');
const User = require('../services/usermodel.js');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };

    req.token = token;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = authMiddleware;
