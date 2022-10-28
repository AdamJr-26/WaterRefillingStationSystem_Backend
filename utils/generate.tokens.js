const jwt = require("jsonwebtoken");
const { userToken } = require("../model/index");

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "14m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });

    const user_token = await userToken.findOne({userId: user._id});
    if(user_token) await userToken.remove();

    new userToken({userId: user._id, token: refreshToken});
    return Promise.resolve({accessToken, refreshToken});

  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = generateTokens