'use strict';

const { createStore } = require('../src/store');

describe('createStore', () => {
  it('supports create, get, update, remove and clear', () => {
    const store = createStore();
    const item = store.create({ name: 'A' });
    expect(store.get(item.id)).toEqual(item);

    const updated = store.update(item.id, { name: 'B', id: 'ignored' });
    expect(updated).toMatchObject({ id: item.id, name: 'B' });

    expect(store.update('missing', { name: 'C' })).toBeUndefined();
    expect(store.remove(item.id)).toBe(true);
    expect(store.remove(item.id)).toBe(false);

    store.create({ name: 'D' });
    store.clear();
    expect(store.list()).toEqual([]);
  });

  it('isolates separate store instances', () => {
    const a = createStore();
    const b = createStore();
    a.create({ name: 'only in a' });
    expect(b.list()).toEqual([]);
  });
});
