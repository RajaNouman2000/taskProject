import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User, userValidationSchema } from "../models/Users.js";
import emailVerification from "../MailVerification/emailVerification.js";

const result = dotenv.config();

if (result.error) {
  console.error(result.error);
}
const secret = process.env.jwtToken;

function customToken() {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    token += alphabet[randomIndex];
  }
  return token;
}

const jwtToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: 12 * 60 * 60 });
};

export const getDetail = async (req, res) => {
  const { id } = req.body;
  try {
    const users = await User.findOne({ _id: id });
    res.send(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log(req.params);

  try {
    // Verify the token against the stored tokens in the database
    const user = await User.findOne({ rememberToken: token });

    if (!user) {
      return res.status(404).json({ error: "Invalid verification token" });
    }

    await User.updateOne(
      { email: user.email },
      { $set: { rememberToken: null } }
    );
    console.log(user);

    res.send({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate the request body
  const { error } = userValidationSchema.validate({
    firstName,
    lastName,
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { token } = req.headers;
  const rememberToken = customToken();

  try {
    let user;

    if (token) {
      const userId = jwt.verify(token, secret);
      const existingUser = await User.findOne({ _id: userId.id });

      console.log(existingUser);
      if (existingUser && existingUser.isAdmin == true) {
        user = await User.create({
          firstName,
          lastName,
          email,
          password,
          rememberToken,
          isAdmin: true,
        });
      } else {
        user = await User.create({
          firstName,
          lastName,
          email,
          password,
          rememberToken,
        });
      }
    } else {
      user = await User.create({
        firstName,
        lastName,
        email,
        password,
        rememberToken,
      });
    }

    emailVerification.add({
      to: user.email,
      subject: "Email Verification",
      html: `<html><p>Click the following button to verify your email</p><button><a href=http://localhost:8080/verify/${rememberToken}>Verify</a></button></html>`,
      text: `Click the following link to verify your email: http://localhost:8080/verify/${rememberToken}`,
      type: "emailVerification",
    });

    res.send("User created successfully");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    const loggedInUser = await User.login(email, password);
    const token = jwtToken(loggedInUser._id);
    res.status(200).json({ user: loggedInUser._id, token: token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
