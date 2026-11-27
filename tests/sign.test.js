const { sign } = require('../src/sign');

test('a positive number, including tiny, huge and Infinity, gives 1', () => {
    for (const x of [5, 0.0001, Number.MIN_VALUE, Number.MAX_VALUE, Infinity]) {
        expect(sign(x)).toBe(1);
    }
});

test('a negative number, including tiny and -Infinity, gives -1', () => {
    for (const x of [-5, -Number.MIN_VALUE, -Infinity]) {
        expect(sign(x)).toBe(-1);
    }
});

test('zero and negative zero give 0', () => {
    expect(sign(0)).toBe(0);
    expect(sign(-0) === 0).toBe(true);
});

test('any value that is not a number throws a TypeError', () => {
    for (const v of ['5', '', null, undefined, true, 5n, [1], {}, new Number(5)]) {
        expect(() => sign(v)).toThrow(TypeError);
    }
    expect(() => sign()).toThrow(TypeError);
});

test('NaN throws a TypeError', () => {
    expect(() => sign(NaN)).toThrow(TypeError);
    expect(() => sign(0 / 0)).toThrow(TypeError);
});
