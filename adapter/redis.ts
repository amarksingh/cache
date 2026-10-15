const Promise = require("bluebird")
const StoreHelper = require('./StoreHelper')
const kClient = Symbol('client')
const kConnection = Symbol('connection')
const { secondsToMs } = require('../utils')
/**
 * Class RedisStore.
 */
class RedisStore extends StoreHelper {

    /**
     * Create a new instance.
     * @param {*} $redisClient
     * @param {*} $config
     * @param {*} $prefix
     */
    constructor($redisClient, $config, $prefix) {
        super($config, $prefix)
        this[kClient] = $redisClient
    }

    /**
     * get method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async get(key) {
        return this.connection().getAsync(this.applyDotPrefix(key)).then(result => {
            return this.parseValue(result)
        })
    }

    /**
     * put method.
     * @async
     * @param {*} key
     * @param {*} value
     * @param {*} seconds
     * @returns {any}
     */
    async put(key, value, seconds = 0) {
        const prefixedKey = this.applyDotPrefix(key)
        let {
            serializedValue,
            valueType
        } = this.serializeValue(value)
        let expiration = seconds == Infinity ? [] : ['EX', (secondsToMs(seconds)).toString()]
        return this.connection().setAsync(prefixedKey, JSON.stringify({
            value: serializedValue,
            valueType: valueType
        }), ...expiration).then(result => true).catch(err => false)
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key) {
        return this.connection().delAsync(this.applyDotPrefix(key)).then(res => true).catch(err => false)
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {
        return this.connection().flushdbAsync().then(res => true).catch(err => false)
    }

    /**
     * connection method.
     * @returns {any}
     */
    connection() {
        return this[kConnection] = this[kConnection] ? this[kConnection] : Promise.promisifyAll(this[kClient].getConnection())
    }

}

module.exports = RedisStore