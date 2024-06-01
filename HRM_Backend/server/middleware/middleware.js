const jwt = require('jsonwebtoken');
const tokenAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
      if (!token) {
        throw new Error("No Token Provided!");
      }
      const splitToken = token.replace(/"/g, '').split(' ')[1];
      if (!splitToken) throw new Error("Invalid Token Format!");
      const decoded = jwt.verify(splitToken, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error, "error in authenticate middleware");
      return res.status(401).json({ error: "Authentication failed" });
    }
  };

module.exports = {tokenAuth};