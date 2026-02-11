const jwt = require("jsonwebtoken");
const User = require("../models/User");

const exploreAuthMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

module.exports = exploreAuthMiddleware;
