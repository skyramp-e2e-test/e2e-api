const { isEven } = require('../src/is-even');

describe('isEven', () => {
    test.each([0, -0, 2, -4, 4.0, 2 ** 60])('reports even integer %p as even', (n) => {
        expect(isEven(n)).toBe(true);
    });

    test.each([1, 3, -1, -3, Number.MAX_SAFE_INTEGER])('reports odd integer %p as not even', (n) => {
        expect(isEven(n)).toBe(false);
    });

    test.each([1.5, -2.5, NaN, Infinity, -Infinity])('throws a TypeError for non-integer number %p', (v) => {
        expect(() => isEven(v)).toThrow(TypeError);
    });

    test.each([
        ['numeric string', '2'],
        ['empty string', ''],
        ['null', null],
        ['undefined', undefined],
        ['boolean', true],
        ['array', [2]],
        ['object', {}],
        ['BigInt', 2n],
        ['boxed Number', new Number(2)],
    ])('throws a TypeError for a non-number value (%s)', (_label, v) => {
        expect(() => isEven(v)).toThrow(TypeError);
    });

    test('throws a TypeError when called with no argument', () => {
        expect(() => isEven()).toThrow(TypeError);
    });
});
