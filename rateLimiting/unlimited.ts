const GlobalLimit = require('./globalLimit');
/**
 * Class Unlimited.
 */
class Unlimited extends GlobalLimit {

    /**
     * Create a new instance.
     */
    constructor() {
        super(Infinity);
    }
}

module.exports = Unlimited;