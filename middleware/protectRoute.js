
exports.ensureAuth = (req, res, next)=> {
  if (req.isAuthenticated()) {
    console.log("✅ protectRoute loaded");
    return next();
  }
  return res.status(401).json({ message: 'Not logged in' });
};
