'use strict';

const express = require('express');
const { createStore } = require('./store');

function validateItem(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }
  const { name, description } = body;
  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return 'name is required and must be a non-empty string';
    }
  }
  if (description !== undefined && typeof description !== 'string') {
    return 'description must be a string';
  }
  if (partial && name === undefined && description === undefined) {
    return 'At least one of name or description must be provided';
  }
  return null;
}

function pickFields({ name, description }) {
  const fields = {};
  if (name !== undefined) fields.name = name.trim();
  if (description !== undefined) fields.description = description;
  return fields;
}

function createApp({ store = createStore() } = {}) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  const router = express.Router();

  router.get('/', (req, res) => {
    res.json(store.list());
  });

  router.get('/:id', (req, res) => {
    const item = store.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  });

  router.post('/', (req, res) => {
    const error = validateItem(req.body);
    if (error) return res.status(400).json({ error });
    return res.status(201).json(store.create(pickFields(req.body)));
  });

  router.put('/:id', (req, res) => {
    const error = validateItem(req.body);
    if (error) return res.status(400).json({ error });
    const fields = { description: '', ...pickFields(req.body) };
    const item = store.update(req.params.id, fields);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  });

  router.patch('/:id', (req, res) => {
    const error = validateItem(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const item = store.update(req.params.id, pickFields(req.body));
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  });

  router.delete('/:id', (req, res) => {
    if (!store.remove(req.params.id)) return res.status(404).json({ error: 'Item not found' });
    return res.status(204).end();
  });

  app.use('/api/items', router);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err, req, res, _next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Malformed JSON' });
    }
    return res.status(err.status || 500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
