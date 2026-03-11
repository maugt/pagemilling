import { createRider } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, name, count } = req.body;

  if (!id || !name || count == null) {
    return res.status(400).json({ error: 'id, name, and count are required' });
  }

  try {
    createRider({ id: Number(id), name, count: Number(count) });
    res.status(201).json({ id: Number(id), name, count: Number(count) });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Rider with that ID already exists' });
    }
    res.status(500).json({ error: err.message });
  }
}
