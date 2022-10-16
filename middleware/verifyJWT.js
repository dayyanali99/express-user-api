const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.get("Authorization") || req.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  // console.log(authHeader); // Bearer token

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
    if (err) return res.sendStatus(403); // invalid token
    req.user = decodedToken.userInfo.username;
    req.roles = decodedToken.userInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
