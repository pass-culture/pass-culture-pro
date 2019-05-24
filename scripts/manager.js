#!/usr/bin/env node
const childProcess = require('child_process')
const fs = require('fs')
const program = require('commander')
const env = require('node-env-file')
const path = require('path')

const { getRunTestcafeCommand } = require('./testcafe')

const fileDir = path.join(__dirname, '/../env_file')
if (fs.existsSync(fileDir)) {
  env(fileDir)
}

program
  .version('0.1.0')

  .option('testcafe', 'testcafe')

  .option('-b, --browser [type]', 'Define browser', 'chrome')
  .option('-d, --debug', 'Debug', '')
  .option('-e, --environment [type]', 'Define environment', 'development')
  .option('-f, --file [type]', 'Define file', '')

  .parse(process.argv)

const { testcafe } = program
const config = Object.assign({ fileDir }, program)

let command
if (testcafe) {
  command = getRunTestcafeCommand(config)
}

childProcess.execSync(command, { stdio: [0, 1, 2] })
