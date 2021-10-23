const chalk = require('chalk')
const log = console.log
const stdout = process.stdout.write

module.exports = class Log {
  constructor () {
    this._groups = {}
  }

  grouping () {

  }

  error () {
    const args = arguments
    console.log(chalk.white.bgRed.bold('ERROR '), chalk.white.bgRed.apply(this, args))
  }

  log () {
    const args = arguments
    console.log(chalk.bgGrey.apply(this, args))
  }
}
