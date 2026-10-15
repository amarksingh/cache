
const InteractsWithTime = require('@ostro/support/interactsWithTime');
const is_null = (val) => val == null;

/**
 * Class RateLimiter.
 */
class RateLimiter extends InteractsWithTime {

    $cache;

    $limiters = {};

    /**
     * Create a new instance.
     * @param {*} $cache
     */
    constructor($cache: any) {
        super();
        this.$cache = $cache;
    }

    for($name, $callback) {
        this.$limiters[$name] = $callback;

        return this;
    }

    /**
     * limiter method.
     * @param {*} $name
     * @returns {any}
     */
    limiter($name: string) {
        return this.$limiters[$name] ?? null;
    }

    /**
     * attempt method.
     * @async
     * @param {*} $key
     * @param {*} $maxAttempts
     * @param {*} $callback
     * @param {*} $decaySeconds
     * @returns {any}
     */
    async attempt($key: string, $maxAttempts: number, $callback: Function, $decaySeconds: number = 60) {
        if (await this.tooManyAttempts($key, $maxAttempts)) {
            return false;
        }
        let $result = await $callback();
        if (is_null($result)) {
            $result = true;
        }

        return this.hit($key, $decaySeconds);

    }

    /**
     * tooManyAttempts method.
     * @async
     * @param {*} $key
     * @param {*} $maxAttempts
     * @returns {any}
     */
    async tooManyAttempts($key: string, $maxAttempts: number) {
        if (await this.attempts($key) >= $maxAttempts) {
            if (await this.$cache.has(this.cleanRateLimiterKey($key) + ':timer')) {
                return true;
            }

            await this.resetAttempts($key);
        }

        return false;
    }

    /**
     * hit method.
     * @async
     * @param {*} $key
     * @param {*} $decaySeconds
     * @returns {any}
     */
    async hit($key: string, $decaySeconds: number = 60) {
        $key = this.cleanRateLimiterKey($key);

        await this.$cache.put(
            $key + ':timer', this.availableAt($decaySeconds), $decaySeconds
        );
        if (!await this.$cache.has($key)) {
            await this.$cache.put($key, 0, $decaySeconds);
        }

        const $hits = await this.$cache.increment($key);

        return $hits;
    }

    /**
     * attempts method.
     * @param {*} $key
     * @returns {any}
     */
    attempts($key: string) {
        $key = this.cleanRateLimiterKey($key);

        return this.$cache.get($key, 0);
    }

    /**
     * resetAttempts method.
     * @param {*} $key
     * @returns {any}
     */
    resetAttempts($key: string) {
        $key = this.cleanRateLimiterKey($key);

        return this.$cache.forget($key);
    }

    /**
     * remaining method.
     * @async
     * @param {*} $key
     * @param {*} $maxAttempts
     * @returns {any}
     */
    async remaining($key: string, $maxAttempts: number) {
        $key = this.cleanRateLimiterKey($key);

        const $attempts = await this.attempts($key);

        return $maxAttempts - $attempts;
    }

    /**
     * retriesLeft method.
     * @param {*} $key
     * @param {*} $maxAttempts
     * @returns {any}
     */
    retriesLeft($key: string, $maxAttempts: number) {
        return this.remaining($key, $maxAttempts);
    }


    /**
     * clear method.
     * @param {*} $key
     * @returns {any}
     */
    clear($key: string) {
        $key = this.cleanRateLimiterKey($key);

        this.resetAttempts($key);

        return this.$cache.forget($key + ':timer');
    }

    /**
     * availableIn method.
     * @async
     * @param {*} $key
     * @returns {any}
     */
    async availableIn($key: string) {
        $key = this.cleanRateLimiterKey($key);
        return Math.max(0, await this.$cache.get($key + ':timer') - this.currentTime());
    }

    /**
     * cleanRateLimiterKey method.
     * @param {*} $key
     * @returns {any}
     */
    cleanRateLimiterKey($key: string) {
        return $key.replace(/&([a-z])[a-z]+;/ig, '$1');
    }
}

module.exports = RateLimiter