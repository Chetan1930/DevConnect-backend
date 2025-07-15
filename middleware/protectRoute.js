console.log("✅ protectRoute loaded");

 exports.ensureAuth = (req, res, next)=> {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not logged in' });
};
