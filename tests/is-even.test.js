const { isEven } = require('../src/is-even');

describe('isEven', () => {
    test.each([0, 2, -4, -0, 2 ** 53])('returns true for the even integer %p', (n) => {
        expect(isEven(n)).toBe(true);
    });

    test.each([1, 7, -3, Number.MAX_SAFE_INTEGER])('returns false for the odd integer %p', (n) => {
        expect(isEven(n)).toBe(false);
    });

    test.each([1.5, 2.0000001, NaN, Infinity, -Infinity])('throws a TypeError for the non-integer number %p', (n) => {
        expect(() => isEven(n)).toThrow(TypeError);
    });

    test.each([
        ['a numeric string', '2'],
        ['null', null],
        ['undefined', undefined],
        ['a BigInt', 2n],
        ['a boolean', true],
        ['an array', [2]],
        ['a Number object', new Number(2)],
    ])('throws a TypeError for %s instead of coercing it', (_label, value) => {
        expect(() => isEven(value)).toThrow(TypeError);
    });

    test('throws a TypeError when called with no argument', () => {
        expect(() => isEven()).toThrow(TypeError);
    });
});
