import passport from 'passport'
import { Router } from 'express';

// Setup authentication
import GithubStrategy from 'passport-github2';

import jwt from 'jsonwebtoken';
import moment from 'moment';

import UserRepositoryFactory from '../repositories/users';

export default ({ config, db, requireAuth }) => {

    let api = Router(),
        UserRepository = UserRepositoryFactory({ db })

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

            done(null, user.get({ plain: true }));
        });
    }));

    api.get('/logout', requireAuth, (req, res) => {
        let user = req.session.user;

        res.clearCookie('kh_username');
        res.clearCookie('kh_github_token');
        req.session.destroy(err => {
            if (err) {
                res.status(400).json({ success: false, code: 'CANNOT_LOGOUT' });
            } else {
                res.json();
            }
        })
    })

    api.get('/socket', requireAuth, (req, res) => {
        let token = jwt.sign(req.session.user, "koocat", {
            expiresIn: "360d"
        });

        res.json({ token });
    })

    api.get('/github', passport.authenticate('github', { scope: ['repo'] }));
    api.get('/github/callback', (req, res, next) => {
        passport.authenticate('github', (err, user, info) => {
            if (err) return res.status(404).json({ message: err });
            if (!user) return res.status(404).json({ message: 'user not logged in' });

            req.session.user = user;
            res.cookie('kh_username', user.username, {
                secure: true,
                sameSite: false, // TODO: toggle to true and access cookie from background page,
                expires: moment().add(100, 'years').toDate()
            });
            res.cookie('kh_github_token', user.token, {
                secure: true,
                sameSite: false, // TODO: toggle to true and access cookie from background page
                expires: moment().add(100, 'years').toDate()
            })

            res.redirect(user.profileUrl);
        })(req, res, next);
    });

    return api
}