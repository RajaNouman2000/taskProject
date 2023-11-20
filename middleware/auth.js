import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.error(result.error);
}
const secret = process.env.jwtToken;

export const authenticateMiddleware = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded.id });
    console.log(user);

    // Check if the user has isAdmin property set to true
    if (user.isAdmin !== true) {
      return res
        .status(403)
        .json({ error: "Forbidden - Insufficient privileges" });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

export default authenticateMiddleware;
