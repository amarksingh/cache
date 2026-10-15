const InvalidArgumentException = require('@ostro/support/exceptions/invalidArgumentException')
const CacheAdapter = require('./cacheAdapter')
const Manager = require('@ostro/support/manager')

/**
 * Class CacheManager.
 */
class CacheManager extends Manager {

    $type = 'cache';

    /**
     * store method.
     * @param {*} name
     * @returns {any}
     */
    store(name = null) {
        return this.driver(name)
    }

    /**
     * resolve method.
     * @param {*} name
     * @returns {any}
     */
    resolve(name) {

        let $config = this.getStoreConfig(name);

        if (!($config)) {
            throw new InvalidArgumentException(`Cache store [${name}] is not defined.`);
        }
        return super.resolve(name, $config)
    }

    /**
     * createMemoryDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createMemoryDriver($config) {
        return this.adapt(new (require('./adapter/memory'))($config));
    }

    /**
     * createRedisDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createRedisDriver($config) {
        return this.adapt(new (require('./adapter/redis'))(new (require('./client/redis'))($config), $config, this.getPrefix()));
    }

    /**
     * createMemcachedDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createMemcachedDriver($config) {
        return this.adapt(new (require('./adapter/memcached'))(new (require('./client/memcached'))($config), $config, this.getPrefix()));
    }

    /**
     * createNullDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createNullDriver($config) {
        return this.adapt(new (require('./adapter/null'))($config));
    }

    /**
     * createFileDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createFileDriver($config) {
        return this.adapt(new (require('./adapter/file'))($config['path'], $config, this.getPrefix()))
    }

    /**
     * createDatabaseDriver method.
     * @param {*} $config
     * @returns {any}
     */
    createDatabaseDriver($config) {
        return this.adapt(new (require('./adapter/database'))($config['table'], this.$container.database))
    }

    /**
     * adapt method.
     * @param {*} $cache
     * @returns {any}
     */
    adapt($cache) {
        return new CacheAdapter($cache, this.getConfig('enabled'));
    }

    /**
     * getPrefix method.
     * @returns {any}
     */
    getPrefix() {
        return super.getConfig(`prefix`);
    }

    /**
     * getStoreConfig method.
     * @param {*} name
     * @returns {any}
     */
    getStoreConfig(name) {
        return this.getConfig(`stores.${name}`);
    }

    /**
     * getDriverConfig method.
     * @param {*} name
     * @returns {any}
     */
    getDriverConfig(name) {
        return this.getStoreConfig(name);
    }

}

module.exports = CacheManager