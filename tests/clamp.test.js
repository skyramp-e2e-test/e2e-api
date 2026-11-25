'use strict';

const clampModule = require('../src/clamp');
const { clamp } = clampModule;

describe('clamp', () => {
  test('exports clamp as a named function', () => {
    expect(typeof clampModule.clamp).toBe('function');
  });

  test('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2.5, -5, 0)).toBe(-2.5);
  });

  test('returns min for a value below min', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-100, -5, 5)).toBe(-5);
  });

  test('returns max for a value above max', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(1e9, 0, 10)).toBe(10);
  });

  test('returns boundary values as is and limits values just past them', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(10.0001, 0, 10)).toBe(10);
    expect(clamp(-0.0001, 0, 10)).toBe(0);
  });

  test('returns the bound when min equals max', () => {
    expect(clamp(3, 7, 7)).toBe(7);
    expect(clamp(9, 7, 7)).toBe(7);
  });

  test('treats reversed bounds as the same range', () => {
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(-3, 10, 0)).toBe(0);
    expect(clamp(5, 10, 0)).toBe(5);
  });
});
