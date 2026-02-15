const jwt = require("jsonwebtoken");

/**
 * Optional Authentication Middleware
 * Token varsa req.user'ı doldurur, yoksa hata vermez işleme devam eder.
 * Bu sayede getPostById gibi rotalarda hem misafirleri hem de üyeleri handle edebiliriz.
 */
const optionalPostAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      // Token doğrulaması
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // Token geçersizse veya süresi dolmuşsa req.user boş kalır ama işlem devam eder
          req.user = null;
        } else {
          // Token geçerliyse kullanıcı bilgisini req.user'a atıyoruz
          req.user = decoded;
        }
        next();
      });
    } else {
      // Header hiç yoksa misafir kullanıcıdır
      req.user = null;
      next();
    }
  } catch (error) {
    console.error("Middleware Hatası:", error);
    req.user = null;
    next();
  }
};

module.exports = { optionalPostAuth };
