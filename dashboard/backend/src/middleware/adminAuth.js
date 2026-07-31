export const requireAdmin = (req, res, next) => {
  const adminSecret = req.headers["x-admin-secret"];
  const expectedSecret = process.env.ADMIN_SECRET;

  // Verify secret key header
  if (!adminSecret || adminSecret !== expectedSecret) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid Admin Secret key." });
  }

  next();
};
