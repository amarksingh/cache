const StoreHelper = require('./StoreHelper')
const kClient = Symbol('client')
const kConnection = Symbol('connection')
const { secondsToMs } = require('../utils')
/**
 * Class MemcachedStore.
 */
class MemcachedStore extends StoreHelper {

    /**
     * Create a new instance.
     * @param {*} $client
     * @param {*} $config
     * @param {*} $prefix
     */
    constructor($client, $config, $prefix) {
        super($config, $prefix)
        this[kClient] = $client
    }

    /**
     * get method.
     * @param {*} key
     * @returns {any}
     */
    get(key) {
        return this.connection().get(this.applyDotPrefix(key)).then(result => {
            return this.parseValue(result.value)
        })
    }

    /**
     * put method.
     * @param {*} key
     * @param {*} value
     * @param {*} seconds
     * @returns {any}
     */
    put(key, value, seconds = 0) {
        const prefixedKey = this.applyDotPrefix(key)
        let {
            serializedValue,
            valueType
        } = this.serializeValue(value)
        let expiration = seconds == Infinity ? 0 : secondsToMs(seconds).toString()
        return this.connection().set(prefixedKey, JSON.stringify({
            value: serializedValue,
            valueType: valueType
        }), { expires: expiration }).then(result => true).catch(err => false)
    }

    /**
     * forget method.
     * @param {*} key
     * @returns {any}
     */
    forget(key) {

        return this.connection().delete(this.applyDotPrefix(key)).then(res => true).catch(err => false)
    }

    /**
     * flush method.
     * @returns {any}
     */
    flush() {

        return this.connection().flush().then(res => true).catch(err => false)
    }

    /**
     * connection method.
     * @returns {any}
     */
    connection() {
        return this[kConnection] = this[kConnection] ? this[kConnection] : this[kClient].getConnection()
    }

}

module.exports = MemcachedStore