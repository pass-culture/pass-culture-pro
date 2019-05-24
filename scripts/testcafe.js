const path = require('path')

exports.getRunTestcafeCommand = ({
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
