'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  it('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2.5, -5, 0)).toBe(-2.5);
  });

  it('returns min for a value below min', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('returns max for a value above max', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  it('returns the bound for a value exactly at a bound', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('returns the single value when min equals max', () => {
    expect(clamp(7, 3, 3)).toBe(3);
  });
});
