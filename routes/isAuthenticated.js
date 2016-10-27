var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.user = {
      twitterDisplayName: null
    };
    next();
  }
}

module.exports = isAuthenticated;
