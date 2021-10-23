#!/usr/bin/env node
require('../src/bootstrap')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const fileExist = require('../src/utils/file-exist')

const usage = `tiles-generator [-c configFile] [-l layersNameToProcess]`
if (argv.help) {
  console.info(usage);
  process.exit(1)
}

//config file
let configFile = '../config.json'
if (argv.c) {
  configFile = argv.c
}
if ( !fileExist(configFile) ) {
  console.log(`\nConfig file ${configFile} not found.\n Usage:\n ${usage} `)
}

//Start application
const App = require('./../src/app.js')
const AppCrt = new App(configFile, argv?.l)

AppCrt.start()
