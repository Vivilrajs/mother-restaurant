'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminReservations() {
  const searchParams = useSearchParams();
  const querySearch = searchParams ? (searchParams.get('search') || '') : '';
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    setLoading(true);
    let url = `/api/reservations?search=${encodeURIComponent(search)}`;
    if (dateFilter) url += `&date=${dateFilter}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    loadItems();
  }, [search, dateFilter]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadItems();
        if (selected && selected._id === id) {
          setSelected(prev => ({ ...prev, status }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadItems();
        setSelected(null);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filteredItems = items.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or phone..."
            className="form-input w-full sm:w-64 bg-white"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="form-input bg-white w-full sm:w-40"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${statusFilter === 'all' ? 'bg-[#2d2422] text-[#fdfbf7]' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${statusFilter === 'confirmed' ? 'bg-[#2d2422] text-[#fdfbf7]' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${statusFilter === 'cancelled' ? 'bg-[#2d2422] text-[#fdfbf7]' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="admin-glass overflow-hidden">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading reservations...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No reservations found.</td></tr>
              ) : filteredItems.map(item => (
                <tr key={item._id} className="cursor-pointer" onClick={() => setSelected(item)}>
                  <td><div className="font-semibold">{item.name}</div><div className="text-xs text-gray-500">{item.occasion || 'No Occasion'}</div></td>
                  <td><div>{item.date}</div><div className="text-xs text-gray-500">{item.time}</div></td>
                  <td>{item.guests}</td>
                  <td><div className="text-xs">{item.phone}</div><div className="text-xs text-gray-500">{item.email}</div></td>
                  <td>
                    <span className={`status-badge ${item.status === 'confirmed' ? 'status-active' : item.status === 'cancelled' ? 'status-out' : 'status-draft'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-right space-x-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => updateStatus(item._id, 'confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Confirm"><i className="fas fa-check"></i></button>
                    <button onClick={() => updateStatus(item._id, 'cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Cancel"><i className="fas fa-times"></i></button>
                    <button onClick={() => deleteItem(item._id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {selected && (
        <div className="admin-modal active" onClick={() => setSelected(null)}>
          <div className="admin-modal-content relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Reservation Details</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 md:p-6 bg-[#fdfbf7] space-y-4">
              <h3 className="font-serif text-2xl font-bold mb-4 border-b pb-2 text-[#2d2422]">{selected.name}</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Occasion:</strong> {selected.occasion || 'None'}</p>
                <p><strong>Guests:</strong> {selected.guests}</p>
                <p><strong>Date & Time:</strong> {selected.date} at {selected.time}</p>
                <p><strong>Phone:</strong> {selected.phone}</p>
                <p><strong>Email:</strong> {selected.email}</p>
                <p><strong>Seating Preference:</strong> {selected.seating || 'No Preference'}</p>
                <p><strong>Special Requests:</strong> {selected.requests || 'None'}</p>
                <p><strong>Status:</strong> <span className={`status-badge capitalize ${selected.status === 'confirmed' ? 'status-active' : selected.status === 'cancelled' ? 'status-out' : 'status-draft'}`}>{selected.status}</span></p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
                <button onClick={() => updateStatus(selected._id, 'confirmed')} className="btn-premium px-4 py-2 rounded-lg text-sm font-semibold">Confirm Reservation</button>
                <button onClick={() => updateStatus(selected._id, 'cancelled')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200">Cancel Reservation</button>
                <button onClick={() => setSelected(null)} className="px-6 py-2 rounded-lg font-bold bg-gray-200 text-gray-700 hover:bg-gray-300">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
