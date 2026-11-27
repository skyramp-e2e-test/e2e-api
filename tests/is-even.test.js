const { isEven } = require('../src/is-even');

test.each([0, -0, 2, 4.0, 2 ** 53, 1e21])('even integer %p is even', (x) => {
    expect(isEven(x)).toBe(true);
});

test.each([1, 7, Number.MAX_SAFE_INTEGER])('odd integer %p is not even', (x) => {
    expect(isEven(x)).toBe(false);
});

test('negative even integer -4 is even', () => {
    expect(isEven(-4)).toBe(true);
});

test.each([-3, -1, Number.MIN_SAFE_INTEGER])('negative odd integer %p is not even', (x) => {
    expect(isEven(x)).toBe(false);
});

test.each([1.5, 2.0000001, NaN, Infinity, -Infinity])('non-integer number %p throws a TypeError', (x) => {
    expect(() => isEven(x)).toThrow(TypeError);
});

test.each(['4', '', null, undefined, true, [2], {}, new Number(4)])('non-number %p throws a TypeError', (x) => {
    expect(() => isEven(x)).toThrow(TypeError);
});

test('no argument throws a TypeError', () => {
    expect(() => isEven()).toThrow(TypeError);
});
