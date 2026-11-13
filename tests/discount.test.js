const { applyDiscount } = require('../src/discount');

test('10% off 100 is 90', () => { expect(applyDiscount(100, 10)).toBe(90); });
test('0% off leaves price unchanged', () => { expect(applyDiscount(50, 0)).toBe(50); });
test('100% off is 0', () => { expect(applyDiscount(80, 100)).toBe(0); });
test('rejects negative price', () => { expect(() => applyDiscount(-1, 10)).toThrow(TypeError); });
test('rejects percent above 100', () => { expect(() => applyDiscount(100, 101)).toThrow(RangeError); });
test('rounds result to 2 decimals', () => { expect(applyDiscount(19.99, 15)).toBe(16.99); });
test('rounds repeating decimals to 2 places', () => { expect(applyDiscount(10, 33.333)).toBe(6.67); });

test('25% off 200 is 150', () => { expect(applyDiscount(200, 25)).toBe(150); });
test('a zero price stays 0 at any percent', () => { expect(applyDiscount(0, 50)).toBe(0); });
test('100% off a fractional price is 0', () => { expect(applyDiscount(19.99, 100)).toBe(0); });
test('rejects a price just below 0 and accepts a price of 0', () => {
  expect(() => applyDiscount(-0.01, 10)).toThrow(TypeError);
  expect(applyDiscount(0, 10)).toBe(0);
});

test.each([
  ['a string', '100'],
  ['NaN', NaN],
  ['undefined', undefined],
  ['null', null],
])('rejects a price that is %s with TypeError', (_label, price) => {
  expect(() => applyDiscount(price, 10)).toThrow(TypeError);
});

test.each([100.0001, -1, -0.0001])('rejects percent %p just outside 0..100 with RangeError', (percent) => {
  expect(() => applyDiscount(100, percent)).toThrow(RangeError);
});

test.each([
  ['NaN', NaN],
  ['a string', '10'],
  ['missing', undefined],
  ['Infinity', Infinity],
])('rejects a percent that is %s with RangeError', (_label, percent) => {
  expect(() => applyDiscount(100, percent)).toThrow(RangeError);
});

test('gives the same result for the same inputs regardless of calls in between', () => {
  const first = applyDiscount(19.99, 15);
  applyDiscount(100, 50);
  const last = applyDiscount(19.99, 15);
  expect(first).toBe(16.99);
  expect(last).toBe(16.99);
});

test('rounds every exact half-cent result by one rule', () => {
  const results = [
    applyDiscount(1.01, 50), // exact 0.505
    applyDiscount(2.01, 50), // exact 1.005
    applyDiscount(2.3, 5), // exact 2.185
    applyDiscount(2.5, 13), // exact 2.175
    applyDiscount(2.65, 10), // exact 2.385
  ];
  const halfUp = [0.51, 1.01, 2.19, 2.18, 2.39];
  const halfEven = [0.5, 1, 2.18, 2.18, 2.38];
  expect([halfUp, halfEven]).toContainEqual(results);
});
