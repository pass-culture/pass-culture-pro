const fs = require('fs')
const path = require('path')

exports.getRunOneTestcafeFileCommand = ({
  browser,
  debug,
  environment,
  file,
  fileDir,
}) => {
  const NODE_ENV = environment === 'local' ? 'development' : environment
  const debugOption = debug ? '-d' : ''
  const testcafeBinDir = path.join(fileDir, '../node_modules/.bin/testcafe')
  const testcafeOptions =
    '--assertion-timeout 5000 --selector-timeout 15000 -c 2'
  const testcafeFileDir = path.join(fileDir, '../testcafe', file)
  return `NODE_ENV=${NODE_ENV} ${testcafeBinDir} ${browser} ${debugOption}\
${testcafeOptions} ${testcafeFileDir}`
}

exports.getRunAllTestcafeFilesCommand = config => {
  const { fileDir } = config
  const workersCount = config.workersCount || 2
  const testFileNames = fs
    .readdirSync(path.join(fileDir, '../testcafe'))
    .filter(dirName => dirName !== 'helpers')
  const fileCommands = testFileNames.map(testFileName =>
    exports.getRunOneTestcafeFileCommand(
      Object.assign({}, config, { file: testFileName })
    )
  )

  const commandsCountPerWorker = fileCommands.length / workersCount

  const command = [...Array(workersCount).keys()]
    .map(workerIndex =>
      fileCommands
        .slice(workerIndex, (workerIndex + 1) * commandsCountPerWorker)
        .join(' && ')
    )
    .join('&')

  return `${command}&`
}

exports.getRunTestcafeCommand = config => {
  const { file } = config
  if (file) {
    return exports.getRunOneTestcafeFileCommand(config)
  }
  return exports.getRunAllTestcafeFilesCommand(config)
}
