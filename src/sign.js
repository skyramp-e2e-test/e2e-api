/** The sign of a number: -1, 0 or 1. Throws a TypeError for anything that is not a number, or NaN. */
function sign(n) {
    if (typeof n !== 'number' || Number.isNaN(n)) throw new TypeError('sign expects a number');
    return n > 0 ? 1 : n < 0 ? -1 : 0;
}

module.exports = { sign };
