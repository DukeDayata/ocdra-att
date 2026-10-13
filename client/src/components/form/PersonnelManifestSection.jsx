import React, { useState } from 'react';
import { Users, Plus, Trash2, Search, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const PersonnelManifestSection = ({ personnelList, selectedPersonnel, onAddPersonnel, onRemovePersonnel, error }) => {
  const [selectedIndex, setSelectedIndex] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonnel = personnelList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedIndex === '') {
      toast.error('Please select a personnel member from the list.');
      return;
    }
    const person = personnelList[selectedIndex];
    if (!person) return;

    if (selectedPersonnel.some(p => p.name.toLowerCase() === person.name.toLowerCase())) {
      toast.error('Personnel already added to manifest.');
      return;
    }

    onAddPersonnel(person);
    setSelectedIndex('');
  };

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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
        <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 shadow-2xs">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Personnel Manifest</h2>
          <p className="text-xs text-slate-500 font-medium">Select and designate authorized CHED personnel joining this travel order.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Personnel Search & Filter */}
        {personnelList.length > 5 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search master personnel by name or position..."
              className="w-full bg-slate-50/80 border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs font-medium"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="flex-1 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition shadow-2xs cursor-pointer"
          >
            <option value="">Select personnel member...</option>
            {filteredPersonnel.map((p, index) => {
              const originalIndex = personnelList.findIndex(item => item._id ? item._id === p._id : item.name === p.name);
              return (
                <option key={p._id || index} value={originalIndex}>
                  {p.name} — {p.position}
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={handleAdd}
            className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-2xl px-6 py-3 font-extrabold text-xs sm:text-sm transition shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add to Manifest</span>
          </button>
        </div>

        {error && <p className="text-rose-500 text-xs mt-1 font-bold">{error}</p>}

        {/* Selected Personnel List */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
            <span>Delegation Members ({selectedPersonnel.length})</span>
            {selectedPersonnel.length > 0 && <span className="text-indigo-600">Active Manifest</span>}
          </div>

          {selectedPersonnel.length === 0 ? (
            <div className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50/50">
              <Users className="w-8 h-8 text-slate-300" />
              <p className="text-xs text-slate-400 font-medium">No personnel members attached to this travel order yet.</p>
              <p className="text-2xs text-slate-400">Select an employee from the dropdown above and click "Add to Manifest".</p>
            </div>
          ) : (
            selectedPersonnel.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border border-slate-200/90 rounded-2xl p-3.5 sm:px-5 bg-white shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 font-black flex items-center justify-center text-xs border border-indigo-200/80 shadow-2xs">
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 tracking-tight">{p.name}</div>
                    <div className="text-2xs uppercase tracking-wider text-slate-500 font-bold">{p.position}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemovePersonnel(idx)}
                  className="text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-rose-200/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
