import jwt from 'jsonwebtoken';
export const generateToken = (user) => {
  if (!user || !user.id || !user.role) {
    throw new Error('Invalid user object for token generation');
  }
  const expiry = process.env.JWT_EXPIRY || '7d';
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};
