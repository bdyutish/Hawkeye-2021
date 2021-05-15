import express, { Request, Response } from "express";
import {
  addHint,
  getLeaderboard,
  banUser,
  UnbanUser,
} from "../controllers/adminController";
import { protect, isAdmin } from "../middlewares/auth";

const router = express.Router();
router.get("/leaderboard", protect, isAdmin, getLeaderboard);

router.post("/hints/:questionid", protect, isAdmin, addHint);

// ban and unban user
router.post("/user/ban/:userId", protect, isAdmin, banUser);
router.post("/user/unban/:userId", protect, isAdmin, UnbanUser);

export { router as adminRouter };
