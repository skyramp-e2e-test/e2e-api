'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  it('returns a value already inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(2.5, 0, 10)).toBe(2.5);
    expect(clamp(-5, -10, -1)).toBe(-5);
  });

  it('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('lowers a value above max to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  it('keeps values at a bound and clamps values just past either bound', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(-0.0001, 0, 10)).toBe(0);
    expect(clamp(10.0001, 0, 10)).toBe(10);
  });

  it('always returns the bound when min equals max', () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(1, 5, 5)).toBe(5);
    expect(clamp(9, 5, 5)).toBe(5);
  });

  it.each([-1, 5, 15])(
    'never returns a value outside the range when bounds are reversed (value %p)',
    (value) => {
      let outcome;
      try {
        outcome = { result: clamp(value, 10, 0) };
      } catch (error) {
        outcome = { error };
      }
      if ('error' in outcome) {
        expect(outcome.error).toBeInstanceOf(Error);
        return;
      }
      expect(outcome.result).toBeGreaterThanOrEqual(0);
      expect(outcome.result).toBeLessThanOrEqual(10);
      expect(outcome.result).toBe(clamp(value, 0, 10));
    },
  );
});
