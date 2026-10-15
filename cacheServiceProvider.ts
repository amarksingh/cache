const ServiceProvider = require('@ostro/support/serviceProvider');
const cacheManager = require('./cacheManager')

/**
 * Class CacheServiceProvider.
 */
class CacheServiceProvider extends ServiceProvider {

    /**
     * register method.
     * @returns {any}
     */
    register() {
       this.$app.singleton('cache', function(app) {
            return new cacheManager(app);
        });
    }

    /**
     * boot method.
     * @async
     * @returns {any}
     */
    async boot() {
    }

}
module.exports = CacheServiceProvider