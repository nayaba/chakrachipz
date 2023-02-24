const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../models/user')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log('A user has logged in with OAuth')
      try {
        let user = await User.findOne({
          googleId: profile.id
        })
        if (user) {
          console.log('User exists --> ', user)
          return cb(null, user)
        }
        user = await User.create({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        })
        console.log('New user has been created!')
      } catch (err) {
        return cb(err)
      }
    }
  )
)

passport.serializeUser(function (user, cb) {
  cb(null, user._id)
})

passport.deserializeUser(async function (userId, cb) {
  cb(null, await User.findById(userId))
})