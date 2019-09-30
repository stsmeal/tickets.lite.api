import * as expressJwt from 'express-jwt';
import * as config from '../../config.json';

export function jwt() {
    const secret = config.secret;
    return expressJwt({secret, isRevoked }).unless({
        path:[
            '/auth/token',
            '/auth/register',
            '/auth/validsite',
            '/auth/create'
        ]
    });
}

async function isRevoked(req, payload, done) {
    done();
}