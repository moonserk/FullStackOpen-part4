const http = require('http')
const logger = require('./src/utils/logger')
const config = require('./src/utils/config')
const app = require('./src/app')

const server = http.createServer(app)

const PORT = config.PORT
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
