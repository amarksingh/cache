import ServiceProvider from '@ostro/support/serviceProvider';
import cacheManager from './cacheManager';

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
export default CacheServiceProvider;