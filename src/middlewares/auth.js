const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    console.log("Received Token:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token Data (before attaching to req.user):", decoded);

    req.user = decoded; // Attach user details to request
    console.log("req.user after assignment:", req.user); // Ensure it's still correct

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;
