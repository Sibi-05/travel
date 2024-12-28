import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ Message: "All Fields Are Required!" });
  } else if (username == " " || email == " " || password == " ") {
    return res.status(400).json({ Message: "Enter the Valid Info!" });
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
      res.status(500).json({ Error: error.message });
    }
  }
  //if the value and key are same user the single word *
};
