'use strict';

const { randomUUID } = require('node:crypto');

function createStore() {
  const items = new Map();

  return {
    list() {
      return Array.from(items.values());
    },
    get(id) {
      return items.get(id);
    },
    create({ name, description = '' }) {
      const now = new Date().toISOString();
      const item = { id: randomUUID(), name, description, createdAt: now, updatedAt: now };
      items.set(item.id, item);
      return item;
    },
    update(id, fields) {
      const existing = items.get(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...fields, id, updatedAt: new Date().toISOString() };
      items.set(id, updated);
      return updated;
    },
    remove(id) {
      return items.delete(id);
    },
    clear() {
      items.clear();
    },
  };
}

module.exports = { createStore };
