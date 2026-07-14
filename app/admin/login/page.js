'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [creds, setCreds] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(creds) });
    if (res.ok) { router.push('/admin'); }
    else { setError('Invalid username or password'); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fdfbf7]">
      <div className="bg-white border border-brand-600/15 shadow-2xl rounded-2xl p-10 w-full max-w-md mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-800"></div>
        <div className="flex justify-center mb-8">
          <div className="logo-container">
            <div><div className="logo-the">THE</div><div className="logo-m">m</div></div>
            <div className="logo-circle"><div className="logo-circle-text">LOVE IS<br/>HER SECRET<br/>INGREDIENT</div></div>
            <div><div className="logo-m">ther</div><div className="logo-restaurant">ADMIN PANEL</div></div>
          </div>
        </div>
        <h2 className="font-serif text-2xl font-bold text-center mb-2 text-heading">Welcome Back</h2>
        <p className="text-sm text-center text-gray-500 mb-8">Enter your credentials to access the dashboard</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brand-800 mb-1">Username</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" className="form-input !pl-10" placeholder="admin" required value={creds.username} onChange={e=>setCreds({...creds,username:e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-800 mb-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="password" className="form-input !pl-10" placeholder="••••••••" required value={creds.password} onChange={e=>setCreds({...creds,password:e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-premium w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-70">
            {loading ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-arrow-right"></i></>}
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
