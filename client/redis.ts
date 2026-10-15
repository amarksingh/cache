const redis = require('redis')
const kConnection = Symbol('connection')
const kConfig = Symbol('config')

/**
 * Class RedisClient.
 */
class RedisClient {

    /**
     * Create a new instance.
     * @param {*} $config
     */
    constructor($config) {
        this[kConfig] = $config
        return this
    }

    /**
     * getConnection method.
     * @returns {any}
     */
    getConnection() {
        if (!this[kConnection]) {
            let server = this[kConfig]['server']
            this[kConnection] = redis.createClient(server['port'],server['host'],server)
            this[kConnection].auth(server['password'])
        }
        return this[kConnection]
    }

}
module.exports = RedisClient