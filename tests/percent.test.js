const { percent } = require('../src/percent');

describe('percent', () => {
  test('returns part as a percentage of a non-zero whole', () => {
    expect(percent(25, 200)).toBe(12.5);
    expect(percent(1, 4)).toBe(25);
    expect(percent(150, 100)).toBe(150);
    expect(percent(-5, 20)).toBe(-25);
    expect(percent(1, 3)).toBeCloseTo(33.3333, 4);
  });

  test('returns whole-number percentages exactly, without float error', () => {
    expect(percent(7, 100)).toBe(7);
    expect(percent(29, 100)).toBe(29);
  });

  test('refuses a whole of 0 with a RangeError, whatever the part', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
    expect(() => percent(0, 0)).toThrow(RangeError);
    expect(() => percent(5, -0)).toThrow(RangeError);
    expect(() => percent(5, 0)).toThrow(/whole/);
    expect(() => percent(5, 0)).toThrow(/0/);
  });

  test('returns 0 for a part of 0 with a non-zero whole', () => {
    expect(percent(0, 5)).toBe(0);
  });
});
