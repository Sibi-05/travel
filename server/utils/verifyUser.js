import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(410, "UnAuthorized"));
  }
  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) {
      return next(errorHandler(410, "UnAuthorized"));
    }
    req.user = user;
    next();
  });
};
