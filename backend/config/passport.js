import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/user.model.js";

// Fallback values for testing (remove after fixing env loading)
const GOOGLE_CLIENT_ID = 
  process.env.GOOGLE_CLIENT_ID ||
  "428824054545-ihhmcn1j0v4tc70ot41jpo3efvs0jo61.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: "428824054545-ihhmcn1j0v4tc70ot41jpo3efvs0jo61.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (existingUser) {
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value,
          isVerified: true,
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// enable if session is used
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

export default passport;
