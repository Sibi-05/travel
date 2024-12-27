import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("DataBase is connected Sucessfully!");
  })
  .catch((error) => {
    console.log(error);
  });
app.listen(process.env.PORT, () => {
  console.log("Server is running on the port 3000!");
});

app.use("/api/user", userRoutes);
