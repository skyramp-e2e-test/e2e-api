const { applyDiscount } = require('../src/discount');

test('10% off 100 is 90', () => { expect(applyDiscount(100, 10)).toBe(90); });
test('0% off leaves price unchanged', () => { expect(applyDiscount(50, 0)).toBe(50); });
test('100% off is 0', () => { expect(applyDiscount(80, 100)).toBe(0); });
test('rejects negative price', () => { expect(() => applyDiscount(-1, 10)).toThrow(TypeError); });
test('rejects percent above 100', () => { expect(() => applyDiscount(100, 101)).toThrow(RangeError); });
test('rounds result to 2 decimals', () => { expect(applyDiscount(19.99, 15)).toBe(16.99); });
test('rounds repeating decimals to 2 places', () => { expect(applyDiscount(10, 33.333)).toBe(6.67); });
