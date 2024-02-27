import path from 'path';
import multer from 'multer';
import jimp from 'jimp';
import User from '../services/usermodel.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const changeAvatar = async (req, res) => {
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

export { changeAvatar };
