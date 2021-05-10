import express, { Request, Response } from "express";
import {
  register,
  login,
  logout,
  getme,
  forgotPassword,
  resetPassword,
  getProfileById,
  resendVerificationEmail,
  verifyUser,
} from "../controllers/authController";
import { protect, isBanned } from "../middlewares/auth";
import { validateRequest } from "../middlewares/requestValidator";
import { body } from "express-validator";

const router = express.Router();
router.post(
  "/register",
  [
    body("email", "Not a valid email").isEmail(),
    body("password", "password should be atleast 8 characters").isLength({
      min: 8,
    }),
    body("name", "Name not entered").notEmpty(),
    body("username", "Username not enetered").notEmpty(),
  ],
  validateRequest,
  register
);
router.post(
  "/login",
  [
    body("email", "email not entered").notEmpty(),
    body("email", "not a valid email").isEmail(),
    body("password", "password should be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  validateRequest,
  isBanned,
  login
);
router.post("/logout", logout);
router.get("/me", protect, getme);
router.get("/profile/:userid", protect, getProfileById);
// router.put('/profile', validateRequest, editProfile);
router.post(
  "/forgotpassword",
  [body("email", "Not a valid email").isEmail()],
  validateRequest,
  forgotPassword
);

router.put(
  "/resetpassword/:resettoken",
  [
    body("password", "password should be atleast 8 characters").isLength({
      min: 8,
    }),
  ],
  validateRequest,
  resetPassword
);

router.post(
  "/verification/",
  [body("email", "Not a valid email").isEmail()],
  validateRequest,
  resendVerificationEmail
);

router.put("/verify/:emailtoken", verifyUser);

export { router as authRouter };
