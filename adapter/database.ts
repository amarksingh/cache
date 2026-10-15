const kConnection = Symbol('connection');
const kTable = Symbol('table');
const StoreHelper = require('./StoreHelper')
const { secondsToMs } = require('../utils')

/**
 * Class Database.
 */
class Database extends StoreHelper {

    /**
     * Create a new instance.
     * @param {*} table
     * @param {*} $connection
     */
    constructor(table, $connection) {
        super();
        this[kTable] = table;
        this[kConnection] = $connection;
    }

    /**
     * get method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async get(key) {
        return this[kConnection].table(this[kTable]).where({ key }).first().then(res => (res || Promise.reject())).then((result) => {
            if (Date.now() / 1000 >= Number(result.expiration)) {
                this.forget(key)
                return Promise.reject()
            }
            try {
                result.value = JSON.parse(result.value);
                return result
            } catch (e) { return result }
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
        let { serializedValue, valueType } = this.serializeValue(value)
        return this[kConnection].table(this[kTable]).updateOrInsert({ key }, {
            value: serializedValue,
            valueType: valueType,
            expiration: secondsToMs(seconds).toString()
        })
            .then(result => true)
            .catch(err => false)
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key) {
        return this[kConnection].table(this[kTable]).where({ key }).delete().then(res => true).catch(err => false)
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {
        return this[kConnection].table(this[kTable]).delete().then(res => true).catch(err => false)
    }
}

module.exports = Database