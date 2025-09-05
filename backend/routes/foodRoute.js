import express from 'express';
import { addFood ,listFood,removeFood} from '../controllers/foodController.js';
import multer from 'multer';
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();
const storage = multer.diskStorage({
  destination: "uploads", // relative to root
  filename: (req, file, cb) => {
    console.log("📸 Received file:", file);
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post('/add', upload.single("image"), addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;