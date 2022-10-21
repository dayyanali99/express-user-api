const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date = require("date-fns");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: `Username and Password are required` });
  }

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401);

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (!match) {
    return res.sendStatus(401);
  }

  // create JWTs
  const roles = Object.values(foundUser.roles);
  const accessToken = generateAccessToken(foundUser, roles);
  const refreshToken = generateRefreshToken(foundUser);

  // saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(result);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    // secure: true,
    maxAge: date.hoursToMilliseconds(24),
  });
  res.json({ accessToken });
};

// HELPER METHODS
function generateAccessToken(user, roles) {
  return jwt.sign(
    { userInfo: { username: user.username, roles } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60s" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
}

module.exports = {
  handleLogin,
};
