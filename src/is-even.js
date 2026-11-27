/** Whether a whole number is even. Throws a TypeError for anything that is not an integer. */
function isEven(n) {
    if (!Number.isInteger(n)) throw new TypeError('isEven expects an integer');
    return n % 2 === 0;
}

module.exports = { isEven };
