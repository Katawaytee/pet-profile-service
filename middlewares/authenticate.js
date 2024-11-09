const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const bearer = req.headers["authorization"];

  if (!bearer) {
    return res.status(401).json({
      code: 401,
      msg: "Token not found",
    });
  }

  const token = bearer.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(401).json({
        code: 401,
        msg: "Invalid Token",
      });
    }

    req.body.user = {
      ...user,
    };

    next();
  });
};

module.exports = authenticate;
