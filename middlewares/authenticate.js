const authenticate = (req, res, next) => {
  // TO BE implement with jwt logic

  req.body.user = {
    userId: "007",
  };

  next();
};

// module.exports = authenticate ;
export default authenticate;
