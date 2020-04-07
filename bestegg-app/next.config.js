const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.build') });

let variables = Object.keys(process.env).reduce((acc, i) => {
    if (i.indexOf('NEXT_') === 0) {
        return {...acc, [i]: process.env[i]}
    } else {
        return acc;
    }
}, {});

module.exports = {
    env: {
        ...variables
    },
};
