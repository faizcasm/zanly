import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import {
  prisma,
  AppError,
  logger,
  generateToken,
  cookieOptions,
  jobQueue,
} from '../routes/route.handler.js';
// ---------------- Passport Serialization ----------------
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ---------------- Google OAuth Strategy ----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // You can save the user info in DB if you want
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0]?.value,
        accessToken,
      };
      done(null, user);
    },
  ),
);

// ---------------- GitHub OAuth Strategy ----------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        image: profile.photos[0]?.value,
        accessToken,
      };
      done(null, user);
    },
  ),
);

// ---------------- OAuth Callback Handler ----------------
const oauthCallback = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError('Authentication failed', 401));

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  let savedUser;
  if (existingUser) {
    savedUser = existingUser;
    logger.info('OAuth login for existing user', user);
  } else {
    savedUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
    logger.info('OAuth new user created', savedUser);
  }

  const token = await generateToken(savedUser);
  await jobQueue.add('sendWelcomeEmail', {
    to: savedUser.email,
    name:savedUser.name,
    emailType:'Login'
  });
  
  res.cookie('token', token, cookieOptions);
  if (savedUser.role === 'ADMIN') {
    return res.redirect(`${process.env.CORS_ORIGIN}/admin`);
  }
  return res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
};

export { oauthCallback, passport };
