import express from "express";

// controllers
import { signinUser, signupUser } from "../controllers/user.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);

export default router;
