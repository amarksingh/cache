
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
    constructor($key = '', $maxAttempts = 60, $decayMinutes = 1) {
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
    static perMinute($maxAttempts) {
        return new this('', $maxAttempts);
    }

    /**
     * perMinutes method.
     * @static
     * @param {*} $decayMinutes
     * @param {*} $maxAttempts
     * @returns {any}
     */
    static perMinutes($decayMinutes, $maxAttempts) {
        return new this('', $maxAttempts, $decayMinutes);
    }

    /**
     * perHour method.
     * @static
     * @param {*} $maxAttempts
     * @param {*} $decayHours
     * @returns {any}
     */
    static perHour($maxAttempts, $decayHours = 1) {
        return new this('', $maxAttempts, 60 * $decayHours);
    }

    /**
     * perDay method.
     * @static
     * @param {*} $maxAttempts
     * @param {*} $decayDays
     * @returns {any}
     */
    static perDay($maxAttempts, $decayDays = 1) {
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
    by($key) {
        this.$key = $key;

        return this;
    }

    /**
     * response method.
     * @param {*} $callback
     * @returns {any}
     */
    response($callback) {
        this.$responseCallback = $callback;

        return this;
    }
}

module.exports = Limit;