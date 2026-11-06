'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  it('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(1.5, 1, 2)).toBe(1.5);
  });

  it('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(-50, -20, -10)).toBe(-20);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('lowers a value above max to max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  it('treats both bounds as inclusive and pulls values just past them back', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(10.0001, 0, 10)).toBe(10);
    expect(clamp(-0.0001, 0, 10)).toBe(0);
  });

  it('returns the bound for any value when min equals max', () => {
    expect(clamp(7, 3, 3)).toBe(3);
    expect(clamp(-1, 3, 3)).toBe(3);
    expect(clamp(3, 3, 3)).toBe(3);
  });

  it('is exported as a named function taking three arguments', () => {
    const mod = require('../src/clamp');
    expect(typeof mod.clamp).toBe('function');
    expect(mod.clamp).toHaveLength(3);
  });
});
