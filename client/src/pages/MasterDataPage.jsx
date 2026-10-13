import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Plus, Search, Check, X, Shield, Sparkles, UserPlus, Mail, Briefcase, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { personnelApi, approverApi } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('personnel'); // 'personnel' or 'approvers'
  const [personnelList, setPersonnelList] = useState([]);
  const [approverList, setApproverList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State for Adding New Master Data
  const [newPerson, setNewPerson] = useState({ name: '', position: '', office: 'Commission on Higher Education - Central Office', email: '' });
  const [newApprover, setNewApprover] = useState({ name: '', position: 'Chairperson' });
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, aRes] = await Promise.all([
        personnelApi.getAll(),
        approverApi.getAll()
      ]);
      setPersonnelList(pRes.data || []);
      setApproverList(aRes.data || []);
    } catch (err) {
      console.error('Failed to load master data:', err);
      toast.error('Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.position) {
      toast.error('Name and position are required');
      return;
    }
    try {
      await personnelApi.create(newPerson);
      toast.success('Personnel added successfully');
      setNewPerson({ name: '', position: '', office: 'Commission on Higher Education - Central Office', email: '' });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add personnel');
    }
  };

  const handleAddApprover = async (e) => {
    e.preventDefault();
    if (!newApprover.name || !newApprover.position) {
      toast.error('Name and position are required');
      return;
    }
    try {
      await approverApi.create(newApprover);
      toast.success('Approver added successfully');
      setNewApprover({ name: '', position: 'Chairperson' });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add approver');
    }
  };

  const handleTogglePerson = async (id) => {
    try {
      await personnelApi.toggleStatus(id);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleToggleApprover = async (id) => {
    try {
      await approverApi.toggleStatus(id);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const filteredPersonnel = personnelList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovers = approverList.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'CH';
    return name
      .split(' ')
      .filter((n) => n.length > 0)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
              Stakeholders Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 rounded-2xl border border-indigo-200/80 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            Master Registry Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Maintain staff directory records and designated institutional approving signatories.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-700/25 transition-all"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>{isAdding ? 'Close Drawer' : activeTab === 'personnel' ? 'Add New Personnel' : 'Add New Approver'}</span>
        </button>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-2.5 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('personnel')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 ${
            activeTab === 'personnel'
              ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Personnel Registry</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'personnel' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {personnelList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approvers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 ${
            activeTab === 'approvers'
              ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Approver Signatories</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'approvers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {approverList.length}
          </span>
        </button>
      </div>

      {/* Add Form Drawer */}
      {isAdding && (
        <div className="bg-slate-50/90 p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md animate-in fade-in duration-200">
          <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{activeTab === 'personnel' ? 'Register New Staff Personnel' : 'Register Designated Approver'}</span>
          </h3>

          {activeTab === 'personnel' ? (
            <form onSubmit={handleAddPerson} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  placeholder="e.g. JUAN DELA CRUZ"
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Designated Position *</label>
                <input
                  type="text"
                  value={newPerson.position}
                  onChange={(e) => setNewPerson({ ...newPerson, position: e.target.value })}
                  placeholder="e.g. Education Supervisor II"
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Office / Station</label>
                <input
                  type="text"
                  value={newPerson.office}
                  onChange={(e) => setNewPerson({ ...newPerson, office: e.target.value })}
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                />
              </div>
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                  placeholder="email@ched.gov.ph"
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                />
              </div>
              <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  Save Personnel Member
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddApprover} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Approver Full Name *</label>
                <input
                  type="text"
                  value={newApprover.name}
                  onChange={(e) => setNewApprover({ ...newApprover, name: e.target.value })}
                  placeholder="e.g. SHIRLEY C. AGRUPIS, Ph.D"
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-2xs uppercase tracking-wider text-slate-600 mb-1.5">Designated Position / Role *</label>
                <input
                  type="text"
                  value={newApprover.position}
                  onChange={(e) => setNewApprover({ ...newApprover, position: e.target.value })}
                  placeholder="e.g. Chairperson / OIC - Chairperson"
                  className="w-full p-3 border border-slate-200/90 rounded-2xl bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none font-medium shadow-2xs"
                  required
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  Save Signatory Approver
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab === 'personnel' ? 'personnel' : 'approvers'} by name or position...`}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200/90 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none bg-white shadow-2xs"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : activeTab === 'personnel' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Office</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPersonnel.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 font-black flex items-center justify-center text-xs shrink-0 border border-blue-200/80 shadow-2xs">
                          {getInitials(p.name)}
                        </div>
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{p.position}</td>
                    <td className="px-6 py-4 text-slate-500">{p.office}</td>
                    <td className="px-6 py-4 text-slate-500">{p.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${
                          p.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleTogglePerson(p._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                          p.active
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/80'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/80'
                        }`}
                      >
                        {p.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Approver Name</th>
                  <th className="px-6 py-4">Designated Position</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredApprovers.map((a) => (
                  <tr key={a._id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 font-black flex items-center justify-center text-xs shrink-0 border border-amber-200/80 shadow-2xs">
                          {getInitials(a.name)}
                        </div>
                        <span className="font-bold text-slate-900">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{a.position}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${
                          a.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {a.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleApprover(a._id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                          a.active
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/80'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/80'
                        }`}
                      >
                        {a.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
