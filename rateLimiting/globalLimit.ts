const Limit = require('./limit');
/**
 * Class GlobalLimit.
 */
class GlobalLimit extends Limit {

    /**
     * Create a new instance.
     * @param {*} $maxAttempts
     * @param {*} $decayMinutes
     */
    constructor($maxAttempts, $decayMinutes = 1) {
        super('', $maxAttempts, $decayMinutes);
    }
}

module.exports = GlobalLimit;