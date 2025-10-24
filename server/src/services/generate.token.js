import jwt from 'jsonwebtoken';
export const generateToken = (user) => {
  if (!user || !user.id || !user.role) {
    throw new Error('Invalid user object for token generation');
  }
  const expiry = process.env.JWT_EXPIRY || '7d';
  const JWT_SECRET =  process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.id, role: user.role },JWT_SECRET, {
    expiresIn: expiry,
  });
  return token;
};
