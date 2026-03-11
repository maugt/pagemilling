import { getAllRiders } from '../../lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const riders = getAllRiders();
  res.status(200).json(riders);
}
