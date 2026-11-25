const { percent } = require('../src/percent');

describe('percent of a non-zero whole', () => {
  test('25 of 200 is 12.5', () => { expect(percent(25, 200)).toBe(12.5); });
  test('1 of 4 is 25', () => { expect(percent(1, 4)).toBe(25); });
  test('50 of 50 is 100', () => { expect(percent(50, 50)).toBe(100); });
  test('0 of 10 is 0', () => { expect(percent(0, 10)).toBe(0); });
  test('150 of 100 is 150', () => { expect(percent(150, 100)).toBe(150); });
  test('-1 of 4 is -25', () => { expect(percent(-1, 4)).toBe(-25); });
  test('1 of -4 is -25', () => { expect(percent(1, -4)).toBe(-25); });
});

describe('percent refuses a whole of 0', () => {
  test('5 of 0 throws a RangeError', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
  });
  test('0 of 0 throws a RangeError', () => {
    expect(() => percent(0, 0)).toThrow(RangeError);
  });
  test('5 of -0 throws a RangeError', () => {
    expect(() => percent(5, -0)).toThrow(RangeError);
  });
  test('5 of 10 does not throw and is 50', () => {
    let result;
    expect(() => { result = percent(5, 10); }).not.toThrow();
    expect(result).toBe(50);
  });
});
