import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "All Fields Are Required!"));
    // return res.status(400).json({ Message: "All Fields Are Required!" });
  } else if (username == " " || email == " " || password == " ") {
    next(errorHandler(400, "Enter the Valid Info!"));
    // return res.status(400).json({ Message: "Enter the Valid Info!" });
  } else {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    try {
      await newUser.save();
      res.status(200).json({ message: "Signed-Up Successfully!" });
    } catch (error) {
      next(error);
      // res.status(500).json({ Error: error.message });
    }
  }
  //if the value and key are same user the single word *
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email == " " || password == " ") {
    next(errorHandler(400, "All Fields Are Required!"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "User not Found !"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Incorect Password !"));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.KEY
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
