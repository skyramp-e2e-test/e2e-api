const { clamp } = require('../src/clamp');

describe('clamp', () => {
  test('returns a value strictly inside [min, max] unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-15, -20, -10)).toBe(-15);
  });

  test('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
    expect(clamp(-50, -20, -10)).toBe(-20);
  });

  test('lowers a value above max to max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  test('returns values at the bounds as-is and clamps values just past a bound', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(10.0001, 0, 10)).toBe(10);
    expect(clamp(-0.0001, 0, 10)).toBe(0);
  });

  test('returns the single bound when min equals max', () => {
    expect(clamp(7, 3, 3)).toBe(3);
    expect(clamp(-1, 3, 3)).toBe(3);
  });
});
