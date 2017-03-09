import passport from 'passport'
import { Router } from 'express';

// Setup authentication
import GithubStrategy from 'passport-github2';

export default ({ config, db }) => {

    let api = Router();

    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_ROUTE}/api/auth/github/callback`
    },
        (accessToken, refreshToken, profile, done) => {
            console.log("verified:", accessToken, refreshToken, profile);
            done();
        }));

    api.get('/github', passport.authenticate('github', { scope: ['repo'] }));
    api.get('/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log("Successful auth");
            res.redirect('/');
        });

    return api
}