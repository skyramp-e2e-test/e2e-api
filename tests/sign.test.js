const { sign } = require('../src/sign');

test('sign is a named export function', () => {
    expect(typeof require('../src/sign').sign).toBe('function');
});

test.each([5, 0.0001, Number.MIN_VALUE, Infinity])('sign(%p) is 1', (v) => {
    expect(sign(v)).toBe(1);
});

test.each([-5, -0.0001, -Infinity])('sign(%p) is -1', (v) => {
    expect(sign(v)).toBe(-1);
});

test('sign of +0 and -0 is 0', () => {
    expect(sign(0)).toBe(0);
    expect(sign(-0) === 0).toBe(true);
});

test.each(['5', null, undefined, 5n, true, {}, [1], new Number(5)])('sign(%p) throws a TypeError', (v) => {
    expect(() => sign(v)).toThrow(TypeError);
});

test('sign with no argument throws a TypeError', () => {
    expect(() => sign()).toThrow(TypeError);
});

test('sign(NaN) throws a TypeError', () => {
    expect(() => sign(NaN)).toThrow(TypeError);
});
