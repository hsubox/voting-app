var hasPermissions = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to log in to do that!");
  res.redirect('/polls');
}

module.exports = hasPermissions;
