import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.models.js";

export const test = (req, res) => {
  res.json({ message: "Api is Working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You Are Not Allowed To Update This User!"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must Contain 6 Characters!"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username < 7 || req.body.username >= 20) {
      return next(
        errorHandler(400, "UserName Must contain 7 to 20 Characters!")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "UserName Does not contain white space!"));
    }

    // if (req.body.username !== req.body.username.toLowerCase()) {
    //   return next(
    //     errorHandler(401, "UserName Does not contain only LowerCase!")
    //   );
    // }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "UserName Does not contain Diffcult characters!")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
