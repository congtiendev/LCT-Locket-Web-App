const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const logger = require('@utils/logger');

const prisma = new PrismaClient();

/**
 * Google OAuth Strategy Configuration
 * Handles authentication via Google OAuth 2.0
 * Only initialized if Google OAuth credentials are configured
 */

// Check if Google OAuth is configured
const isGoogleOAuthEnabled =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (isGoogleOAuthEnabled) {
  logger.info('Google OAuth is enabled - initializing strategy');

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
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              provider: true,
              googleId: true,
              status: true,
            },
          });

          if (user) {
            // User exists with this Google ID - update last login
            logger.info(`Existing Google user found: ${user.email}`);
            return done(null, user);
          }

          // Check if user exists with this email
          user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              provider: true,
              googleId: true,
              status: true,
            },
          });

          if (user) {
            // User exists with email but different provider
            // Link Google account to existing user
            logger.info(`Linking Google account to existing user: ${email}`);

            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                provider: 'google',
                avatar: avatar || user.avatar,
                lastLoginAt: new Date(),
              },
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                provider: true,
                googleId: true,
                status: true,
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
              provider: 'google',
              status: 'ACTIVE',
              lastLoginAt: new Date(),
            },
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              provider: true,
              googleId: true,
              status: true,
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
          avatar: true,
          provider: true,
          googleId: true,
          status: true,
        },
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
} else {
  logger.warn(
    'Google OAuth is disabled - missing environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL)'
  );
}

module.exports = passport;
