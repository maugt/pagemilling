import { getRiderById, updateRider, deleteRider } from '../../../../lib/db';

export default function handler(req, res) {
  const id = Number(req.query.id);

  if (req.method === 'PUT') {
    const { name, count } = req.body;
    if (!name || count == null) {
      return res.status(400).json({ error: 'name and count are required' });
    }
    const existing = getRiderById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Rider not found' });
    }
    updateRider(id, { name, count: Number(count) });
    res.status(200).json({ id, name, count: Number(count) });
  } else if (req.method === 'DELETE') {
    const existing = getRiderById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Rider not found' });
    }
    deleteRider(id);
    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
