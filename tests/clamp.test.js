const { clamp } = require('../src/clamp');

test('a value strictly inside the range is returned unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-2.5, -5, 0)).toBe(-2.5);
});

test('a value below min is raised to min', () => {
  expect(clamp(-1, 0, 10)).toBe(0);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
  expect(clamp(4, 5, 10)).toBe(5);
});

test('a value above max is lowered to max', () => {
  expect(clamp(11, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('the bounds are inclusive and min === max returns that bound', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(7, 7, 7)).toBe(7);
  expect(clamp(3, 7, 7)).toBe(7);
});
