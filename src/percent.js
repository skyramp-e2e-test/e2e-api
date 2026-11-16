function toPercent(n) {
  if (typeof n !== 'number') {
    throw new TypeError('toPercent expects a number');
  }
  return Math.round(n * 100) + '%';
}
module.exports = { toPercent };
// UC-10.5 follow-up
