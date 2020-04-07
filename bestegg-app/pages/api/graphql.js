import * as jwt from 'express-jwt';
import * as jwks from "jwks-rsa";
import {graphql, buildSchema} from 'graphql';

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.NEXT_AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.NEXT_AUDIENCE,
    issuer: `https://${process.env.NEXT_AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, result => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    hello: (obj, context) => {
        console.log('context', context);
        return `Hello ${context.user}!`;
    },
};

async function handler(req, res) {
    try {
        await runMiddleware(req, res, jwtCheck);
    } catch (e) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }
    console.log('user', req.user);
    const result = await graphql(schema, req.body.query, root, {user: req.user.sub});
    res.end(JSON.stringify(result));
}

export default handler
