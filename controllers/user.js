import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// user sign in controller
export const signinUser = async (req, res) => {
  // we receive email and password in sign-in step
  // ruolong: 1. check if the email exists? 2. check if the password matches the one in db?
  // if both are ok, get the json web token
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({
        message: "User does not exist",
      });
    }
    // compare the input password with hashed password in db
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Password is not correct",
      });
    }

    // if email and password are both correct, we get the token and send it back
    // In the token we encode the email and id.
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "7d" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// user sign-up controller
export const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
    }
    // Check if two passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ message: `Passwords don't match` });
    }
    // Hash the password, create a new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });
    console.log("new user created and saved to database!");
    console.log(newUser);

    // Create token and return to frontend
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", {
      expiresIn: "7d",
    });
    console.log("Token was created: ", token);

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
