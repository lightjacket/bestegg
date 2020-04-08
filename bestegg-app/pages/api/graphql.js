import * as jwt from 'express-jwt';
import * as jwks from "jwks-rsa";
import {graphql, buildSchema} from 'graphql';
import {GraphQLClient} from "graphql-request";
import schemaStr from '../../schema/clientSchema.gql';

const schema = buildSchema(schemaStr);

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

const faunadb = new GraphQLClient('https://graphql.fauna.com/graphql', {
    headers: {
        Authorization: `Bearer ${process.env.NEXT_FAUNADB_SECRET}`
    }
});

// The root provides a resolver function for each API endpoint
const root = {
    addEggPic: async (obj, {user}, {variableValues: {eggPicId}}) => {
        await faunadb.request(`
            mutation AddEggId($user: String!, $picId: String!) {
                createEggPic(data: {user: $user, id: $picId}) {
                    user
                    id
                }
            }
        `, {user, picId: eggPicId});
        return {status: 'ok'};
    },
    test: async (obj, {user}, {variableValues: {}}) => {
        return 'hello!';
    }
};

async function handler(req, res) {
    try {
        await runMiddleware(req, res, jwtCheck);
    } catch (e) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }
    const result = await graphql(schema, req.body.query, root, {user: req.user.sub}, req.body.variables);
    res.end(JSON.stringify(result));
}

export default handler

