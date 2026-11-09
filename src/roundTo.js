'use strict';

function roundTo(value, decimals = 0) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value must be a number');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError('decimals must be a non-negative integer');
  }
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

module.exports = { roundTo };
