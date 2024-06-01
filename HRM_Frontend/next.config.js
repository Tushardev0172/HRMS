const dotenv = require('dotenv')
module.exports = {
    reactStrictMode: false,
    env: dotenv.config().parsed ?? {},
}