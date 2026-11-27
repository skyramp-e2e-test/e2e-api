const { isEven } = require('../src/is-even');

test('isEven returns true for even integers, including 0, -0, negatives and large values', () => {
    expect(isEven(0)).toBe(true);
    expect(isEven(2)).toBe(true);
    expect(isEven(-4)).toBe(true);
    expect(isEven(-0)).toBe(true);
    expect(isEven(2 ** 60)).toBe(true);
});

test('isEven returns false for odd integers, including negatives and MAX_SAFE_INTEGER', () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(-3)).toBe(false);
    expect(isEven(Number.MAX_SAFE_INTEGER)).toBe(false);
});

test.each([1.5, NaN, Infinity, -Infinity, '2', null, undefined, true, 2n, [2], {}])(
    'isEven throws a TypeError for the non-integer %p',
    (v) => {
        expect(() => isEven(v)).toThrow(TypeError);
    },
);
