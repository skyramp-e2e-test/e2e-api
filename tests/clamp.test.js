'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  it('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, -10, -1)).toBe(-5);
  });

  it('returns min for a value below min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('returns max for a value above max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  it('returns a value equal to a bound as-is and clamps one just past it', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(10.5, 0, 10)).toBe(10);
    expect(clamp(-0.5, 0, 10)).toBe(0);
  });

  it('treats the bounds as swapped when min is greater than max', () => {
    expect(clamp(5, 10, 0)).toBe(5);
    expect(clamp(42, 10, 0)).toBe(10);
    expect(clamp(-3, 10, 0)).toBe(0);
  });

  it('always returns the bound when min equals max', () => {
    expect(clamp(7, 3, 3)).toBe(3);
    expect(clamp(-1, 3, 3)).toBe(3);
  });
});
