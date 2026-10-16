import memcached from 'memjs';

const kConnection: unique symbol = Symbol('connection');
const kConfig: unique symbol = Symbol('config');

/**
 * Class MemCache.
 */
class MemCache {

    [kConnection]?: any;
    [kConfig]: Record<string, any>;

    /**
     * Create a new instance.
     * @param $config - Memcached configuration object
     */
    constructor($config: Record<string, any>) {
        this[kConfig] = $config;
        if (typeof this[kConfig] == 'object' && this[kConfig] !== null) {
            this[kConfig].options = {};
        }
    }

    /**
     * Get or create Memcached connection.
     * @returns Memcached client connection
     */
    getConnection(): any {
        if (!this[kConnection]) {
            const server = this[kConfig]['server'];
            this[kConnection] = (memcached as any).Client.create(
                server['host'] + ':' + server['port'],
                { username: server['user'], password: server['password'], ...this[kConfig].options }
            );
        }
        return this[kConnection];
    }

}

export = MemCache;