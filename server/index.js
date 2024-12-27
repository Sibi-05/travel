import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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
