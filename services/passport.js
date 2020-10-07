const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const passport = require("passport");
const config = require('config');
const User = require('../models/userModel')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        clientID: config.get('clientId'),
        clientSecret: config.get('client_Secret'),
        callbackURL: "/auth/google/callback",
        proxy: true
    },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ socialId: profile.id })
                .then(existingUser => {
                    if (existingUser) {
                        done(null, existingUser)
                    }
                    else {
                        new User({
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            socialId: profile.id,
                            token: accessToken,
                        }).save().then(user => {
                            done(null, user)
                        }).catch(e => {
                            console.log('not save', e)
                        })
                    }
                })
        })
)


passport.use(new FacebookStrategy({
    clientID: config.get('FACEBOOK_APP_ID'),
    clientSecret: config.get('FACEBOOK_APP_SECRET'),
    profileFields: ['id', 'displayName', 'photos', 'email'],
    callbackURL: "/auth/facebook/callback",
    enableProof: true,
    proxy: true,
},
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ socialId: profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser)
                } else {
                    new User({
                        email: faker.internet.email(),
                        socialId: profile.id,
                        token: accessToken
                        // username: profile.displayName,
                    }).save()
                        .then(user => {
                            done(null, user)
                        }).catch(e => {
                            console.log('not save', e)
                        })
                }
            })
    }
))


passport.use(
    new GitHubStrategy({
        clientID: config.get('GITHUB_CLIENT_ID'),
        clientSecret: config.get('GITHUB_CLIENT_SECRET'),
        callbackURL: "/auth/github/callback",
        proxy: true
    },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ socialId: profile.id })
                .then(existingUser => {
                    if (existingUser) {
                        done(null, existingUser)
                    }
                    else {
                        new User({
                            email: faker.internet.email(),
                            socialId: profile._json.node_id,
                            username: profile._json.login,
                            token: accessToken,
                        }).save().then(user => {
                            done(null , user)
                        }).catch(e => {
                            console.log('github user not save', e)
                        })
                    }
                })
        })
)