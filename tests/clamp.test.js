const { clamp } = require('../src/clamp');

test('a value inside the range is returned unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(2.5, 0, 10)).toBe(2.5);
});

test('a value below min is raised to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
});

test('a value above max is lowered to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('a value at a bound is that bound, and min === max returns it', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(-1, 4, 4)).toBe(4);
  expect(clamp(9, 4, 4)).toBe(4);
});

test('bounds given in reverse order are the same range', () => {
  expect(clamp(15, 10, 0)).toBe(10);
  expect(clamp(-3, 10, 0)).toBe(0);
  expect(clamp(5, 10, 0)).toBe(5);
  for (const x of [15, -3, 5]) expect(clamp(x, 10, 0)).toBe(clamp(x, 0, 10));
});
