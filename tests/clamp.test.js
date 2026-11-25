'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  test('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(3.5, 0, 10)).toBe(3.5);
  });

  test('raises a value below min to min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(-0.001, 0, 10)).toBe(0);
  });

  test('lowers a value above max to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(10.001, 0, 10)).toBe(10);
  });

  test('returns a value exactly at min or max unchanged', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  test('treats reversed bounds as the same range', () => {
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(-3, 10, 0)).toBe(0);
    expect(clamp(5, 10, 0)).toBe(5);
  });

  test('clamps to a degenerate range and to negative ranges', () => {
    expect(clamp(7, 3, 3)).toBe(3);
    expect(clamp(-7, -5, -1)).toBe(-5);
    expect(clamp(0, -5, -1)).toBe(-1);
  });
});
