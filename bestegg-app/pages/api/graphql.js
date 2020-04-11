import * as jwt from 'express-jwt';
import * as jwks from "jwks-rsa";
import {buildSchema, graphql} from 'graphql';
import {GraphQLClient} from "graphql-request";
import schemaStr from '../../schema/clientSchema.gql';
import * as cloudinary from "cloudinary";

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

cloudinary.config({
    cloud_name: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_CLOUDINARY_API_SECRET
});

// The root provides a resolver function for each API endpoint
const root = {
    addEggPic: async ({eggPicId, eggId}, {user}) => {
        const {findEggByID: data} = await faunadb.request(`
            query FindEgg($eggId: ID!) {
              findEggByID(id: $eggId) {
                name
                picIds
                user
              }
            }
        `, {eggId});

        if(data.user !== user) {
            throw new Error('access denied');
        }

        await faunadb.request(`
            mutation AddPic($name: String!, $picIds: [String!]!, $user: String!, $eggId: ID!) {
              updateEgg(id: $eggId, data: {name: $name, picIds: $picIds, user: $user}) {
                _id
              }
            }
        `, {...data, eggId, picIds: [eggPicId, ...data.picIds]});

        return {status: 'ok'};
    },
    myEggs: async ({}, {user}) => {
        const eggs = await faunadb.request(`
            query Eggs($user: String!) {
                eggs(user: $user) {
                    data {
                      name
                      picIds
                      _id
                    }
                }
            }
        `, {user});
        return eggs.eggs.data.map(e => ({name: e.name, picIds: e.picIds, id: e._id}));
    },
    allEggs: async ({}, {user}) => {
        const {allOfTheEggs} = await faunadb.request(`
            query AllOfTheEggs {
              allOfTheEggs {
                data {
                  name
                  _id
                  picIds
                }
              }
            }
        `);
        return allOfTheEggs.data.map(e => ({name: e.name, picIds: e.picIds, id: e._id}));
    },
    addEgg: async ({name, picIds}, {user}) => {
        const result = await faunadb.request(`
           mutation CreateEgg($name: String!, $user: String!, $picIds: [String!]!) {
              createEgg(data: {name: $name, picIds: $picIds, user: $user}) {
                _id
              }
           }
        `, {user, name, picIds});
        // {createEgg: {_id: eggId}}
        return {id: result.createEgg._id};
    },
    deleteEgg: async ({eggId}, {user}) => {
        const {findEggByID: data} = await faunadb.request(`
            query FindEgg($eggId: ID!) {
              findEggByID(id: $eggId) {
                name
                picIds
                user
              }
            }
        `, {eggId});

        if(data.user !== user) {
            throw new Error('access denied');
        }

        await Promise.all(data.picIds.map(i => new Promise((resolve) => {
            cloudinary.uploader.destroy(i, function(result) { resolve(result) });
        })));

        await faunadb.request(`
            mutation DeleteEgg($eggId: ID!) {
              deleteEgg(id: $eggId) {
                _id
              }
            }
        `, {eggId: eggId});

        return {status: 'ok'};
    },
    test: async ({}, {user}) => {
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

