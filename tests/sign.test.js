'use strict';

const { sign } = require('../src/sign');

describe('sign', () => {
  test.each([5, 0.0001, Number.MIN_VALUE, Infinity])('positive number %p gives 1', (n) => {
    expect(sign(n)).toBe(1);
  });

  test.each([-5, -Number.MIN_VALUE, -Infinity])('negative number %p gives -1', (n) => {
    expect(sign(n)).toBe(-1);
  });

  test.each([0, -0])('zero %p gives 0', (n) => {
    expect(sign(n) === 0).toBe(true);
  });

  test.each([
    ['string', '5'],
    ['null', null],
    ['undefined', undefined],
    ['boolean', true],
    ['object', {}],
    ['array', [1]],
    ['bigint', 10n],
    ['Number object', new Number(3)],
  ])('non-number (%s) throws a TypeError', (_label, v) => {
    expect(() => sign(v)).toThrow(TypeError);
  });

  test('no argument throws a TypeError', () => {
    expect(() => sign()).toThrow(TypeError);
  });

  test('NaN throws a TypeError', () => {
    expect(() => sign(NaN)).toThrow(TypeError);
    expect(() => sign(0 / 0)).toThrow(TypeError);
  });
});
