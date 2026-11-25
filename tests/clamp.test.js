const { clamp } = require('../src/clamp');

describe('clamp', () => {
  test('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  test('lowers a value above max to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('treats both bounds as inclusive and clamps values just past them', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(10.0001, 0, 10)).toBe(10);
    expect(clamp(-0.0001, 0, 10)).toBe(0);
  });

  test('always yields the bound when min equals max', () => {
    expect(clamp(7, 7, 7)).toBe(7);
    expect(clamp(3, 7, 7)).toBe(7);
    expect(clamp(9, 7, 7)).toBe(7);
  });

  test('swaps reversed bounds so results match the ordered range', () => {
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(-3, 10, 0)).toBe(0);
    expect(clamp(5, 10, 0)).toBe(5);
    expect(clamp(15, 10, 0)).toBe(clamp(15, 0, 10));
    expect(clamp(-3, 10, 0)).toBe(clamp(-3, 0, 10));
    expect(clamp(5, 10, 0)).toBe(clamp(5, 0, 10));
  });

  test('clamps negative ranges, fractional values and infinities', () => {
    expect(clamp(-50, -20, -10)).toBe(-20);
    expect(clamp(-15, -20, -10)).toBe(-15);
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(Infinity, 0, 10)).toBe(10);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });
});
