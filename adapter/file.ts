const fs = require('fs-extra')
const StoreHelper = require('./StoreHelper')
const { secondsToMs } = require('../utils')
/**
 * Class FileStore.
 */
class FileStore extends StoreHelper {

    /**
     * Create a new instance.
     * @param {*} $root
     * @param {*} $config
     * @param {*} $prefix
     */
    constructor($root: any, $config: Record<string, any>, $prefix: any) {
        super($config, $prefix)
        this.setRootPath($root)
    }

    /**
     * get method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async get(key: string) {
        return fs.readJson(this.applyPathPrefix(key)).then((result) => {
            if (Date.now() / 1000 >= Number(result.expiration)) {
                this.forget(key)
                return Promise.reject()
            }
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
    async put(key: string, value: any, seconds: number = 0) {
        let { serializedValue, valueType } = this.serializeValue(value)
        return fs.writeJson(this.applyPathPrefix(key), ({
            value: serializedValue,
            valueType: valueType,
            expiration: secondsToMs(seconds).toString()
        }))
            .then(result => true)
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key: string) {
        return fs.remove(this.applyPathPrefix(key))
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {
        return fs.emptyDir(this.getRootPath())
    }
}

module.exports = FileStore