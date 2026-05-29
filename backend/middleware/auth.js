function fakeAuth(req, res, next) {
  // For dev/testing:
  // Consumer request example:
  //   x-user-id: u123
  //   x-user-role: consumer
  //
  // Creator request example:
  //   x-user-id: c123
  //   x-user-role: creator

  const userId = req.header("x-user-id") || "anonymous";
  const role = (req.header("x-user-role") || "consumer").toLowerCase();

  req.user = { id: userId, role };
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { fakeAuth, requireRole };
