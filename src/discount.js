'use strict';

function applyDiscount(price, percent) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new TypeError('price must be a non-negative number');
  }
  if (typeof percent !== 'number' || !Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new RangeError('percent must be a number between 0 and 100');
  }
  const discounted = price - (price * percent) / 100;
  return Math.round((discounted + Number.EPSILON) * 100) / 100;
}

module.exports = { applyDiscount };
