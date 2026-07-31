import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Sign in to continue." });
  }

  try {
    const payload = verifyToken(token);
    req.candidateId = payload.sub; // ObjectId string
    req.candidateCode = payload.candidateId; // human candidateId like "TN-0002"
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Your session expired. Sign in again." });
  }
}
