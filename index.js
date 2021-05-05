const logger = require('./src/utils/logger')
const config = require('./src/utils/config')
const app = require('./src/app')

const PORT = config.PORT
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})
