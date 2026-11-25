const { clamp } = require('../src/clamp');

test('a value inside the range is returned unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(2.5, 0, 10)).toBe(2.5);
  expect(clamp(-5, -10, -1)).toBe(-5);
});

test('a value below min is raised to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
  expect(clamp(-20, -10, -1)).toBe(-10);
});

test('a value above max is lowered to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
});

test('a value at either limit is returned as is and just past it gives the limit', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(-0.0001, 0, 10)).toBe(0);
  expect(clamp(10.0001, 0, 10)).toBe(10);
});

test('reversed bounds are swapped so the value is clamped to [max, min]', () => {
  expect(clamp(5, 10, 0)).toBe(5);
  expect(clamp(-3, 10, 0)).toBe(0);
  expect(clamp(15, 10, 0)).toBe(10);
});

test('a degenerate range where min equals max always returns that bound', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(-1, 3, 3)).toBe(3);
});
