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
    constructor($maxAttempts: number, $decayMinutes: number = 1) {
        super('', $maxAttempts, $decayMinutes);
    }
}

module.exports = GlobalLimit;