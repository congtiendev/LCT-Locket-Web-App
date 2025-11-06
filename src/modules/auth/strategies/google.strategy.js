const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const logger = require('@utils/logger');

const prisma = new PrismaClient();

/**
 * Google OAuth Strategy Configuration
 * Handles authentication via Google OAuth 2.0
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        logger.info(`Google OAuth callback received for: ${profile.emails[0].value}`);

        const email = profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName;
        const avatar = profile.photos[0]?.value;

        // Check if user exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        if (user) {
          // User exists with this Google ID - update last login
          logger.info(`Existing Google user found: ${user.email}`);
          return done(null, user);
        }

        // Check if user exists with this email
        user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // User exists with email but different provider
          // Link Google account to existing user
          logger.info(`Linking Google account to existing user: ${email}`);

          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId,
              provider: 'GOOGLE',
              emailVerified: true, // Google emails are verified
              avatar: avatar || user.avatar,
            },
          });

          return done(null, user);
        }

        // Create new user with Google account
        logger.info(`Creating new user from Google: ${email}`);

        user = await prisma.user.create({
          data: {
            email,
            googleId,
            name,
            avatar,
            provider: 'GOOGLE',
            emailVerified: true, // Google emails are already verified
            status: 'ACTIVE',
          },
        });

        logger.info(`New Google user created: ${user.id}`);
        return done(null, user);
      } catch (error) {
        logger.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

/**
 * Serialize user for session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        status: true,
        provider: true,
      },
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
