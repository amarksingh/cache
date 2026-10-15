
/**
 * Class Limit.
 */
class Limit {

    /**
     * Create a new instance.
     * @param {*} $key
     * @param {*} $maxAttempts
     * @param {*} $decayMinutes
     */
    constructor($key: string = '', $maxAttempts: number = 60, $decayMinutes: number = 1) {
        this.$key = $key;
        this.$maxAttempts = $maxAttempts;
        this.$decayMinutes = $decayMinutes;
    }


    /**
     * perMinute method.
     * @static
     * @param {*} $maxAttempts
     * @returns {any}
     */
    static perMinute($maxAttempts: number) {
        return new this('', $maxAttempts);
    }

    /**
     * perMinutes method.
     * @static
     * @param {*} $decayMinutes
     * @param {*} $maxAttempts
     * @returns {any}
     */
    static perMinutes($decayMinutes: number, $maxAttempts: number) {
        return new this('', $maxAttempts, $decayMinutes);
    }

    /**
     * perHour method.
     * @static
     * @param {*} $maxAttempts
     * @param {*} $decayHours
     * @returns {any}
     */
    static perHour($maxAttempts: number, $decayHours: number = 1) {
        return new this('', $maxAttempts, 60 * $decayHours);
    }

    /**
     * perDay method.
     * @static
     * @param {*} $maxAttempts
     * @param {*} $decayDays
     * @returns {any}
     */
    static perDay($maxAttempts: number, $decayDays: number = 1) {
        return new this('', $maxAttempts, 60 * 24 * $decayDays);
    }

    /**
     * none method.
     * @static
     * @returns {any}
     */
    static none() {
        const Unlimited = require('./unlimited');
        return new Unlimited;
    }

    /**
     * by method.
     * @param {*} $key
     * @returns {any}
     */
    by($key: string) {
        this.$key = $key;

        return this;
    }

    /**
     * response method.
     * @param {*} $callback
     * @returns {any}
     */
    response($callback: Function) {
        this.$responseCallback = $callback;

        return this;
    }
}

module.exports = Limit;