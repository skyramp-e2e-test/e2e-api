const { clamp } = require('../src/clamp');

test('a value inside the range is returned unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
});

test('a value below min is raised to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
});

test('a value above max is lowered to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
});

test('values exactly at min and max are kept', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
});

test('swapped bounds clamp to the swapped range', () => {
  expect(clamp(15, 10, 0)).toBe(10);
  expect(clamp(-1, 10, 0)).toBe(0);
  expect(clamp(5, 10, 0)).toBe(5);
});

test('equal bounds give that bound', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(-7, 3, 3)).toBe(3);
});
