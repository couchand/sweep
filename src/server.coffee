#server

express = require 'express'

app = express()

app.get '/', (req, res) -> res.sendfile './www/index.html'
app.get '/sweeper.js', (req, res) -> res.sendfile './www/sweeper.js'

port = process.env.PORT or 5000
app.listen port, ->
  console.log "listening on #{port}"
