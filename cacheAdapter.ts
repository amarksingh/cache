const { promiseAll, getSeconds } = require('./utils')
const kAdapter = Symbol('adapter')
const Promise = require("bluebird")
let kIncrementOrDecrement = Symbol('incrementOrDecrement')
const kEnabled = Symbol('enabled')

/**
 * Class Cache.
 */
class Cache {

    [kAdapter];
    [kEnabled];

    /**
     * Create a new instance.
     * @param {*} $adapter
     * @param {*} $enabled
     */
    constructor($adapter, $enabled = true) {
        this[kAdapter] = $adapter;
        this[kEnabled] = $enabled;
    }

    /**
     * has method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async has(key) {
        if (this[kEnabled] == false) {
            return false
        }
        const data = await this.get(key);
        return Boolean(typeof data !== undefined && data) || false
    }

    /**
     * get method.
     * @async
     * @param {*} key
     * @param {*} defaultValue
     * @returns {any}
     */
    async get(key, defaultValue = null) {
        if (this[kEnabled] == false) {
            return null
        }
        return this[kAdapter].get(key).then(result => result.value)
            .catch(err => defaultValue)
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
        if (this[kEnabled] == false) {
            return true

        }
        seconds = getSeconds(seconds)
        if (isNaN(seconds)) {
            seconds = 0
        }
        return this[kAdapter].put(key, value, seconds)
            .then(result => {
                if (result == true)
                    return true
                else
                    return Promise.reject(false)
            })
            .catch(err => false)
    }

    /**
     * pull method.
     * @async
     * @param {*} key
     * @param {*} defaultValue
     * @returns {any}
     */
    async pull(key, defaultValue = null) {
        return this.get(key, defaultValue).then(async (value) => {
            return this.forget(key).then(res => value).catch(err => null)
        })
    }

    /**
     * many method.
     * @async
     * @param {*} keys
     * @returns {any}
     */
    async many(keys) {
        return Promise.all(keys.map(key => this.get(key)))
            .then(values => {
                let mappedValues = {}
                for (let i = 0; i < keys.length; i++) {
                    mappedValues[keys[i]] = values[i]
                }
                return mappedValues
            })
    }

    /**
     * putMany method.
     * @async
     * @param {*} object
     * @param {*} seconds
     * @returns {any}
     */
    async putMany(object = {}, seconds) {
        for (let prop in object) {
            object[prop] = this.put(prop, object[prop], getSeconds(seconds));
        }
        return promiseAll(object)
    }

    async [kIncrementOrDecrement](key, value, callback) {
        return this[kAdapter].get(key).then((result) => {
            if (Date.now() / 1000 >= Number(result.expiration)) {
                this.forget(key)
                return false
            }
            if (result.value === undefined) {
                return false
            }
            const currentValue = parseInt(result.value)
            if (isNaN(currentValue)) {
                return false
            }
            const newValue = callback(currentValue)
            return this.put(key, newValue, result.expiration)
                .then(res => res === true ? newValue : false)
                .catch(err => false)
        })
            .catch(err => false)
    }

    /**
     * increment method.
     * @async
     * @param {*} key
     * @param {*} value
     * @returns {any}
     */
    async increment(key, value = 1) {
        return this[kIncrementOrDecrement](key, value, (currentValue) => {
            return currentValue + value
        })
            .catch(err => false)
    }

    /**
     * decrement method.
     * @async
     * @param {*} key
     * @param {*} value
     * @returns {any}
     */
    async decrement(key, value = 1) {
        return this[kIncrementOrDecrement](key, value, (currentValue) => {
            return currentValue - value
        })
            .catch(err => false)
    }

    /**
     * forever method.
     * @async
     * @param {*} key
     * @param {*} value
     * @returns {any}
     */
    async forever(key, value) {
        return this.put(key, value, Infinity)
    }

    /**
     * remember method.
     * @async
     * @param {*} key
     * @param {*} seconds
     * @param {*} cb
     * @returns {any}
     */
    async remember(key, seconds = 0, cb) {
        if (typeof cb != 'function') {
            throw Error('Callback is required.')
        }
        return this.get(key).then(async res => {
            if (res == null) {
                if (cb.length == 1) {
                    res = Promise.fromCallback(cb)
                } else {
                    res = cb()
                }

                res = await Promise.resolve(res)

                if (res) {
                    await this.put(key, res, getSeconds(seconds))
                }
            }
            return res
        })
    }

    /**
     * rememberForever method.
     * @async
     * @param {*} key
     * @param {*} cb
     * @returns {any}
     */
    async rememberForever(key, cb) {
        if (typeof cb != 'function') {
            throw Error('Callback should be required.')
        }
        return this.remember(key, Infinity, cb)
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key) {
        if (this[kEnabled] == false) {
            return true
        }
        return this[kAdapter].forget(key).then(res => true).catch(err => false)
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {
        if (this[kEnabled] == false) {
            return true
        }
        return this[kAdapter].flush().then(res => true).catch(err => false)
    }

}

module.exports = Cache
