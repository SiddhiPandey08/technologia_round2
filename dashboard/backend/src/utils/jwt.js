import jwt from 'jsonwebtoken'

export function signToken(candidate) {
  return jwt.sign({ sub: candidate._id.toString(), candidateId: candidate.candidateId }, process.env.JWT_SECRET, {
    expiresIn: '4h',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
