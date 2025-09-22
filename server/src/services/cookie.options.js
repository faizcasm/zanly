const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'None' : 'Lax',
  maxAge: parseInt(process.env.JWT_EXPIRY) || 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export default cookieOptions;
