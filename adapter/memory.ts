const StoreHelper = require('./StoreHelper');
const kStorage = Symbol('storage');
const { secondsToMs } = require('../utils')

/**
 * Class ObjectStore.
 */
class ObjectStore extends StoreHelper {

    /**
     * Create a new instance.
     * @param {*} $config
     */
    constructor($config: Record<string, any>) {
        super($config)
        this[kStorage] = Object.create(null)
    }

    /**
     * get method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async get(key: string) {
        let cache = this[kStorage][this.applyDotPrefix(key)]
        if (cache === undefined) {
            return Promise.reject()
        }
        if (Date.now() / 1000 >= cache.expiration) {
            this.forget(key)
            return Promise.reject()
        }
        return Promise.resolve(cache)
    }

    /**
     * put method.
     * @async
     * @param {*} key
     * @param {*} value
     * @param {*} seconds
     * @returns {any}
     */
    async put(key: string, value: any, seconds: number = 0) {
        let expiration = secondsToMs(seconds);
        this[kStorage][this.applyDotPrefix(key)] = {
            value: value,
            expiration: expiration
        }
        return true
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key: string) {
        delete this[kStorage][this.applyDotPrefix(key)]
        return Promise.resolve(true)
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {

        this[kStorage] = {}
        return Promise.resolve(true)

    }
}

module.exports = ObjectStore