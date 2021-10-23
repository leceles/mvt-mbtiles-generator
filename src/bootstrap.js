require('dotenv').config()
require('module-alias/register')
const Log = require('helpers/log')
process.log = new Log()
