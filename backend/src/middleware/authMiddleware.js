const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token;

  // Header'dan token al
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Token doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı ekle (şifre hariç)
      //req.user = await User.findById(decoded.id).select("-password"); // geriye _id, username, email döner

      req.user = await User.findById(decoded.id).select(
        "username email _id followers following",
      ); // geriye _id, username, email, followers, following döner

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token geçersiz" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Token yok" });
  }
};

module.exports = authMiddleware;
