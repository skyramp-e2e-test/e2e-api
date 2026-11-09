'use strict';

const percentModule = require('../src/percent');

const { toPercent } = percentModule;

describe('toPercent', () => {
  it('exports toPercent as a named function', () => {
    expect(typeof percentModule.toPercent).toBe('function');
  });

  it('converts a fraction in [0, 1] to a whole-number percent string', () => {
    expect(toPercent(0.5)).toBe('50%');
    expect(toPercent(0)).toBe('0%');
    expect(toPercent(1)).toBe('100%');
    expect(typeof toPercent(0.5)).toBe('string');
  });

  it('rounds fractional percentages to the nearest whole percent', () => {
    const results = [0.123, 0.124, 0.125, 0.005].map(toPercent);
    expect(results).toEqual(['12%', '12%', '13%', '1%']);
    for (const result of results) {
      expect(result).not.toContain('.');
    }
  });

  it('converts numbers outside [0, 1] by the same rule', () => {
    expect(toPercent(-0.5)).toBe('-50%');
    expect(toPercent(1.5)).toBe('150%');
    expect(toPercent(-0.005)).toBe('0%');
  });

  it.each([
    ['a numeric string', '0.5'],
    ['null', null],
    ['undefined', undefined],
    ['a boolean', true],
    ['an object', {}],
    ['an array', [0.5]],
    ['a BigInt', 10n],
    ['a Number wrapper object', new Number(0.5)],
  ])('throws a TypeError for %s', (_label, value) => {
    expect(() => toPercent(value)).toThrow(TypeError);
    expect(() => toPercent(value)).toThrow('toPercent expects a number');
  });

  it('throws a TypeError when called with no argument', () => {
    expect(() => toPercent()).toThrow(TypeError);
    expect(() => toPercent()).toThrow('toPercent expects a number');
  });

  it('does not coerce numeric or empty strings into a percent', () => {
    expect(() => toPercent('0.5')).toThrow(TypeError);
    expect(() => toPercent('')).toThrow(TypeError);
  });
});
