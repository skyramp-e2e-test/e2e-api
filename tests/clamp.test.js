const { clamp } = require('../src/clamp');

test('clamp returns a value inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
});

test('clamp raises a value below min to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
});

test('clamp lowers a value above max to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
});

test('clamp keeps values equal to the bounds and clamps values just past them', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(10.0001, 0, 10)).toBe(10);
  expect(clamp(-0.0001, 0, 10)).toBe(0);
});

test('clamp swaps bounds when min is greater than max', () => {
  const expected = { '-3': 0, 5: 5, 15: 10 };
  for (const x of [-3, 5, 15]) {
    expect(clamp(x, 10, 0)).toBe(expected[x]);
    expect(clamp(x, 10, 0)).toBe(clamp(x, 0, 10));
  }
});

test('clamp returns the bound for a degenerate range', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(-1, 3, 3)).toBe(3);
});

test('clamp handles negative and fractional ranges numerically', () => {
  expect(clamp(-50, -20, -10)).toBe(-20);
  expect(clamp(-5, -20, -10)).toBe(-10);
  expect(clamp(1.5, 0.5, 1.25)).toBe(1.25);
});
