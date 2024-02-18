
import jwt from 'jsonwebtoken';
import User from '../services/usermodel.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decodedToken = jwt.verify(tokenParts[1], 'shhhhh');
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user || user.token !== tokenParts[1]) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };

    req.token = tokenParts[1];

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export default authMiddleware;

