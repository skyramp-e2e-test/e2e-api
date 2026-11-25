const { clamp } = require('../src/clamp');

describe('clamp', () => {
  test('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2.5, -5, 5)).toBe(-2.5);
  });

  test('returns min for a value below min', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  test('returns max for a value above max', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  test('keeps a value exactly at min or max (bounds are inclusive)', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(-0.001, 0, 10)).toBe(0);
    expect(clamp(10.001, 0, 10)).toBe(10);
  });

  test('returns the bound for any value when min equals max', () => {
    expect(clamp(5, 7, 7)).toBe(7);
    expect(clamp(-3, 7, 7)).toBe(7);
    expect(clamp(7, 7, 7)).toBe(7);
  });
});
