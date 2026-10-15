const path = require('path')
const url = require('url')
const crypto = require('crypto')
const fs = require('fs-extra')
const { valueType } = require('@ostro/support/function')
const kConfig = Symbol('config')
const kPrefix = Symbol('prefix')
const kRootPath = Symbol('rootPah')
const kRootUrl = Symbol('rootUrl')

/**
 * Class StoreHelper.
 */
class StoreHelper {

    /**
     * Create a new instance.
     * @param {*} config
     * @param {*} prefix
     */
    constructor(config, prefix = '') {
        this[kConfig] = config;
        this[kPrefix] = prefix;
    }

    /**
     * getConfig method.
     * @returns {any}
     */
    getConfig() {
        return this[kConfig] || null
    }

    /**
     * setRootUrl method.
     * @param {*} root
     * @returns {any}
     */
    setRootUrl(root) {
        this[kRootUrl] = url.resolve(root, '')
    }

    /**
     * setRootPath method.
     * @param {*} root
     * @returns {any}
     */
    setRootPath(root) {
        this[kRootPath] = path.normalize(root)
        fs.mkdirSync(path.normalize(this[kRootPath]), {
            recursive: true
        })
    }

    /**
     * getPrefix method.
     * @returns {any}
     */
    getPrefix() {
        return this[kPrefix] || ''
    }

    /**
     * applyDotPrefix method.
     * @param {*} key
     * @returns {any}
     */
    applyDotPrefix(key = '') {
        return this.getPrefix() + '.' + key
    }

    /**
     * getRootPath method.
     * @returns {any}
     */
    getRootPath() {
        return this[kRootPath]
    }

    /**
     * applyPathPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyPathPrefix(dest) {
        return path.resolve(this[kRootPath], crypto.createHash('md5').update(this.getPrefix() + '_' + dest).digest('hex'))
    }

    /**
     * getRootUrl method.
     * @returns {any}
     */
    getRootUrl() {
        return this[kRootUrl]
    }

    /**
     * applyUrlPrefix method.
     * @param {*} dest
     * @returns {any}
     */
    applyUrlPrefix(dest = '/') {
        return url.resolve(([this[kRootUrl], dest].join('/')), '')
    }

    /**
     * ensureDirectory method.
     * @param {*} dir
     * @param {*} callback
     * @returns {any}
     */
    ensureDirectory(dir, callback) {
        fs.ensureDir(dir, callback)
    }

    /**
     * parsePath method.
     * @param {*} dest
     * @returns {any}
     */
    parsePath(dest) {
        return path.parse(dest)
    }

    /**
     * dirname method.
     * @param {*} dest
     * @returns {any}
     */
    dirname(dest) {
        return this.parsePath(dest).dir
    }

    /**
     * getContent method.
     * @param {*} content
     * @returns {any}
     */
    getContent(content) {
        if (Array.isArray(content))
            return content[0]
        else
            return content
    }

    /**
     * getBufferData method.
     * @param {*} content
     * @returns {any}
     */
    getBufferData(content) {
        return this.getContent(content).buffer
    }

    /**
     * valueType method.
     * @param {*} value
     * @returns {any}
     */
    valueType(value) {
        return valueType(value);
    }

    /**
     * serializeValue method.
     * @param {*} value
     * @returns {any}
     */
    serializeValue(value) {
        let dataType = this.valueType(value)
        return {
            serializedValue: dataType != 'string' ? JSON.stringify(value) : value,
            valueType: dataType
        }
    }

    /**
     * parseValue method.
     * @param {*} obj
     * @returns {any}
     */
    parseValue(obj) {
        obj = Buffer.isBuffer(obj) ? obj.toString() : obj
        obj = typeof obj == 'string' ? JSON.parse(obj) : obj
        if (['json', 'array', 'number'].includes(obj.valueType)) {
            obj.value = JSON.parse(obj.value)
        }
        obj.expiration = Number(obj.expiration)
        return obj
    }
}
module.exports = StoreHelper