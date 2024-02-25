import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import multer from 'multer';
import jimp from 'jimp';
import User from './services/usermodel.js';
import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage(); 
const upload = multer({ storage });
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));
app.patch('/users/avatars', upload.single('avatar'), async (req, res) => {
  try {
    const { file } = req;
    const { user } = req; 

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarBuffer = await jimp.read(file.buffer);
    await avatarBuffer.resize(250, 250).writeAsync(path.join(__dirname, 'tmp', `${user._id}.jpg`));

    const avatarFileName = `${user._id}-${Date.now()}.jpg`;
    await avatarBuffer.writeAsync(path.join(__dirname, 'public', 'avatars', avatarFileName));

    user.avatarURL = `/avatars/${avatarFileName}`;
    await user.save();

    return res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use('/api/users', userRouter);
app.use('/auth', userRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

