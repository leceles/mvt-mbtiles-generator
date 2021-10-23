require('./bootstrap')
const path = require('path')
const fs = require('fs')
const fileExist = require('./utils/file-exist')
const EventEmitter = require('events').EventEmitter

class MainController extends EventEmitter {
  constructor (configFile, watchConfig) {
    super()
    this._configFile = configFile
    this._config = this._loadConfigContent()
    this._watchConfig()
    this._running = false
    this._DATA_DIR = (process?.env?.DATA_DIR || path.resolve(__dirname, '../data/'))
  }

  _loadConfigContent () {
    let configContent
    try {
      configContent = JSON.parse(fs.readFileSync(this._configFile))
    } catch (e) {
      console.error('Error reading config file')
      console.error(e)
      process.exit(2)
    }
    this._config = configContent
    return configContent
  }

  _watchConfig () {
    fs.watchFile(this._configFile, (current, prev) => {
      this._loadConfigContent()
      this.restart()
    })
  }

  start () {
    if (!this._running) {
      this._running = true
      this.parseLayers()
    }
  }

  stop () {

  }

  restart () {

  }

  async parseLayers () {
    for (let i = 0; i < this._config.length; i++) {
      const layer = this._config[i]

      if (layer.enable === false) continue

      for (let ii = 0; ii < layer.strategies.length; ii++) {
        const strategy = layer.strategies[ii]

        const strategyDriver = strategy.driver
        if (strategyDriver) {
          let Strategy
          try {
            // TODO, verificar o que isso faz com a memoria
            Strategy = require(path.resolve(__dirname, 'strategies/', strategyDriver))
          } catch (e) {
            process.log.error('Loading Strategy Driver ',strategyDriver)
            process.log.error(e)
            continue
          }
          try {
            await new Strategy(layer, this._DATA_DIR).start()
          } catch (e) {
            process.log.error('Converting layer:', layer.name)
            process.log.log(e)
          }
        }
      }
    }
  }
}

module.export = MainController

// Start application
// config file
const configFile = './config.json'
if (!fileExist(configFile)) {
  console.log(`\nConfig file ${configFile} not found.`)
}
const AppCrt = new MainController(configFile)
AppCrt.start()
