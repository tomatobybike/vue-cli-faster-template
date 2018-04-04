require('./check-versions')()

var config = require("../config")
process.env.NODE_ENV = 'production'

var opn = require("opn")
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var express = require("express")
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    if(process.env.npm_config_preview){
      var app = express()
      var staticPath = path.posix.join(
        config.build.assetsPublicPath,
        config.build.assetsSubDirectory
      )
      console.log('staticPath:'+staticPath)
      app.use('/', express.static(path.join(__dirname, '../dist')))
      var port = 8081
      var uri = "http://localhost:" + port +""
      var server = app.listen(port)
      console.log('> Listening at ' +  'http://localhost:'+ port + '\n')
      opn(uri)
    }
  })
})
