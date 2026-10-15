/**
 * Class NullStore.
 */
class NullStore {

    /**
     * get method.
     * @async
     * @param {*} key
     * @param {*} defaultValue
     * @returns {any}
     */
    async get(key: string, defaultValue: any = null) {
        return null
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
        return true
    }

    /**
     * forget method.
     * @async
     * @param {*} key
     * @returns {any}
     */
    async forget(key: string) {
        return true
    }

    /**
     * flush method.
     * @async
     * @returns {any}
     */
    async flush() {
        return true
    }

}

module.exports = NullStore