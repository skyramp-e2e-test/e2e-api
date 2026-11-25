'use strict';

function percent(part, whole) {
  if (whole === 0) {
    throw new RangeError('whole must not be 0');
  }
  return (part / whole) * 100;
}

module.exports = { percent };
