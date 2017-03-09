import passport from 'passport'
import { Router } from 'express';

// Setup authentication
import GithubStrategy from 'passport-github2';

import UserRepositoryFactory from '../repositories/users';

export default ({ config, db }) => {

    let api = Router(),
        UserRepository = UserRepositoryFactory({ db })

    db.sync();

    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_ROUTE}/api/auth/github/callback`
    }, (accessToken, refreshToken, profile, done) => {
        UserRepository.findOrCreate({
            username: profile.username,
            token: accessToken,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl
        }).then(({ user, created }) => {
            if (created) {
                console.log("[New User]:", user.username, `(${user.displayName})`);
            } else {
                console.log("[User Login]:", user.username, `(${user.displayName})`);
            }

            done();
        });
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