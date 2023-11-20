import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fs from "fs/promises";

import emailVerification from "./MailVerification/emailVerification.js";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import User from "./models/Users.js";

// Load environment variables from .env file
const result = dotenv.config();

if (result.error) {
  console.error(result.error);
}
// Now you can access your environment variables using process.env
const dbURI = process.env.db;
const port = process.env.port;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/admin", taskRouter);

mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(port, () => console.log("listening"));
  })
  .catch((error) => console.log(error));

const userDB = await User.find({});

// Read user data from the JSON file
try {
  const userData = await fs.readFile("users.json", "utf-8");
  const users = JSON.parse(userData);

  // Check if the users array is empty
  if (userDB.length === 0) {
    // Add data from the JSON file to the database
    try {
      const newUsers = await User.create(users);

      const email = [];
      for (let user = 0; user < users.length; user++) {
        console.log(users[user].email, users[user].rememberToken);

        emailVerification.add({
          to: users[user].email,
          subject: "Email Verification",
          html: `<html><p>Click the following button to verify your email</p><button><a href=http://localhost:8080/verify/${users[user].rememberToken}>Verify</a></button></html>`,
          text: `Click the following link to verify your email: http://localhost:8080/verify/${users[user].rememberToken}`,
          type: "emailVerification",
        });
      }

      console.log(users);

      console.log("Users added to the database:", newUsers);
    } catch (error) {
      console.error("Error adding users to the database:", error.message);
    }
  } else {
    console.log("Users already exist in the database.");
  }
} catch (error) {
  console.error("Error reading users.json:", error.message);
}
