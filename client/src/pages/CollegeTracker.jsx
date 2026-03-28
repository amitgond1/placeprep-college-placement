import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, ThumbsUp, TrendingUp, Filter, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const COMPANIES = ['TCS','Wipro','Infosys','Cognizant','Accenture','Amazon','Google','Microsoft','Flipkart','Zoho','Capgemini','HCL','Tech Mahindra','Others'];
const TEST_TYPES = ['Online Test','Aptitude Test','Coding Test','Direct Interview','Campus Drive','Off-Campus'];

export default function CollegeTracker() {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [college, setCollege] = useState(user?.college || '');
  const [searchCollege, setSearchCollege] = useState(user?.college || '');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ year: '', minPkg: '', maxPkg: '' });
  const [form, setForm] = useState({ college: user?.college || '', company: 'TCS', package: '', cgpaCutoff: '', rounds: 3, testType: 'Online Test', year: new Date().getFullYear(), notes: '' });

  useEffect(() => { if (searchCollege) fetchPlacements(); }, [searchCollege, filters]);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const params = { college: searchCollege, ...filters };
      const [placRes, trendRes] = await Promise.all([
        api.get('/college/placements', { params }),
        api.get(`/college/stats/${encodeURIComponent(searchCollege)}`)
      ]);
      setPlacements(placRes.data.placements || []);
      setTrendData((trendRes.data.stats || []).map(s => ({
        year: s._id, avg: Math.round(s.avgPackage * 10) / 10, max: s.maxPackage, count: s.count
      })).sort((a, b) => a.year - b.year));
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const submitEntry = async () => {
    if (!form.college || !form.package) { toast.error('College name and package are required'); return; }
    try {
      await api.post('/college/placements', { ...form, package: Number(form.package), cgpaCutoff: Number(form.cgpaCutoff), rounds: Number(form.rounds) });
      toast.success('Entry submitted! Thanks for contributing.');
      setShowModal(false);
      fetchPlacements();
    } catch { toast.error('Submission failed'); }
  };

  const upvote = async (id) => {
    try {
      const { data } = await api.post(`/college/placements/${id}/upvote`);
      setPlacements(prev => prev.map(p => p._id === id ? { ...p, upvotes: data.upvotes } : p));
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>College Placement Tracker</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Crowd-sourced placement data from students</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex gap-3">
          <input value={college} onChange={e => setCollege(e.target.value)}
            placeholder="Search your college name..."
            className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none focus:border-purple-500"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            onKeyDown={e => e.key === 'Enter' && setSearchCollege(college)} />
          <button onClick={() => setSearchCollege(college)} className="btn-primary px-5">Search</button>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <input type="number" placeholder="Year" value={filters.year} onChange={e => setFilters(p => ({ ...p, year: e.target.value }))}
            className="w-24 px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="number" placeholder="Min LPA" value={filters.minPkg} onChange={e => setFilters(p => ({ ...p, minPkg: e.target.value }))}
            className="w-24 px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="number" placeholder="Max LPA" value={filters.maxPkg} onChange={e => setFilters(p => ({ ...p, maxPkg: e.target.value }))}
            className="w-24 px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Trend Chart */}
      {trendData.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Package Trend — {searchCollege}
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} unit=" LPA" />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                formatter={(v) => [`${v} LPA`]} />
              <Line type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed' }} name="Avg Package" />
              <Line type="monotone" dataKey="max" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 2" dot={{ fill: '#06b6d4' }} name="Max Package" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : placements.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp size={40} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchCollege ? `No placement data for "${searchCollege}" yet.` : 'Search for your college above.'}
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            <Plus size={15} /> Be the first to add data
          </button>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Company','Package','CGPA Cutoff','Rounds','Test Type','Year','Votes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {placements.map((p, i) => (
                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{p.company}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{p.package} LPA</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.cgpaCutoff || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.rounds}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.testType}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.year}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => upvote(p._id)} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-purple-500/10"
                      style={{ color: 'var(--text-secondary)' }}>
                      <ThumbsUp size={12} /> {p.upvotes}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg p-6 rounded-2xl max-h-[85vh] overflow-y-auto" style={{ background: 'var(--bg-card)' }}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Add Placement Entry</h3>
              <button onClick={() => setShowModal(false)}><X size={20} style={{ color: 'var(--text-secondary)' }} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'College Name', key: 'college', type: 'text', placeholder: 'Your college name' },
                { label: 'Package (LPA)', key: 'package', type: 'number', placeholder: '3.5' },
                { label: 'CGPA Cutoff', key: 'cgpaCutoff', type: 'number', placeholder: '7.0' },
                { label: 'Year', key: 'year', type: 'number', placeholder: '2024' },
                { label: 'Notes', key: 'notes', type: 'text', placeholder: 'Any additional info...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-purple-500"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Company</label>
                  <select value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {COMPANIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Test Type</label>
                  <select value={form.testType} onChange={e => setForm(p => ({ ...p, testType: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    {TEST_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={submitEntry} className="btn-primary w-full justify-center py-3">Submit Entry</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
