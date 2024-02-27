import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/userRouter.js"; 
import { changeAvatar } from './controllers/avatarController.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage(); 
const upload = multer({ storage });
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));
app.patch('/users/avatars', upload.single('avatar'), changeAvatar);

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

