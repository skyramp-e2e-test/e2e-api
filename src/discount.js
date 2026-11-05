'use strict';

function isValidPercent(p) {
  return typeof p === 'number' && Number.isFinite(p) && p >= 0 && p <= 100;
}

function applyDiscount(price, percent) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new TypeError('price must be a non-negative number');
  }
  if (!isValidPercent(percent)) {
    throw new RangeError('percent must be a number between 0 and 100');
  }
  const discounted = price - (price * percent) / 100;
  return Math.round((discounted + Number.EPSILON) * 100) / 100;
}

module.exports = { applyDiscount, isValidPercent };
