import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(400, "UnAuthorized"));
  }
  jwt.verify(token, process.env.KEY, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Token has expired"));
      }
      return next(errorHandler(401, "UnAuthorized"));
    }

    req.user = user;
    console.log(req.user);
    next();
  });
};
