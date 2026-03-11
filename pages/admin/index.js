import { useEffect, useState } from 'react';

export default function Admin() {
  const [riders, setRiders] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', count: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadRiders = () => {
    fetch('/api/riders')
      .then(r => r.json())
      .then(setRiders)
      .catch(err => setError(err.message));
  };

  useEffect(loadRiders, []);

  const resetForm = () => {
    setForm({ id: '', name: '', count: '' });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (editingId != null) {
      const res = await fetch(`/api/admin/riders/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, count: Number(form.count) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
    } else {
      const res = await fetch('/api/admin/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(form.id), name: form.name, count: Number(form.count) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
    }

    resetForm();
    loadRiders();
  };

  const handleEdit = (rider) => {
    setForm({ id: String(rider.id), name: rider.name, count: String(rider.count) });
    setEditingId(rider.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this rider?')) return;
    const res = await fetch(`/api/admin/riders/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    loadRiders();
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1>Rider Admin</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          Strava ID
          <br />
          <input
            type="number"
            value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })}
            disabled={editingId != null}
            required
            style={{ width: 140 }}
          />
        </label>
        <label>
          Name
          <br />
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: 200 }}
          />
        </label>
        <label>
          Count
          <br />
          <input
            type="number"
            value={form.count}
            onChange={e => setForm({ ...form, count: e.target.value })}
            required
            min="0"
            style={{ width: 80 }}
          />
        </label>
        <button type="submit">{editingId != null ? 'Update' : 'Add'}</button>
        {editingId != null && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Count</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.map(rider => (
            <tr key={rider.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{rider.id}</td>
              <td style={{ padding: '0.5rem' }}>{rider.name}</td>
              <td style={{ padding: '0.5rem' }}>{rider.count}</td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleEdit(rider)} style={{ marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => handleDelete(rider.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
