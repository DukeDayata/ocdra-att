import React, { useState } from 'react';
import { Users, Plus, Trash2, Search } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Personnel Manifest</h2>
          <p className="text-xs text-slate-500">Select and include verified staff members to this authority order.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Personnel Search & Filter */}
        {personnelList.length > 5 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search personnel by name or position..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-chedBlue focus:outline-none"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl p-3 text-sm bg-white focus:ring-2 focus:ring-chedBlue focus:outline-none transition shadow-sm"
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
            className="bg-chedNavy hover:bg-chedBlue text-white rounded-xl px-6 py-3 font-semibold text-sm transition shadow-sm shrink-0 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Personnel
          </button>
        </div>

        {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}

        {/* Selected Personnel List */}
        <div className="mt-4 space-y-2">
          {selectedPersonnel.length === 0 ? (
            <div className="flex items-center gap-2 border border-dashed border-slate-200 rounded-xl px-4 py-6 justify-center bg-slate-50/50">
              <p className="text-xs text-slate-400">No official personnel selected for travel order manifest yet.</p>
            </div>
          ) : (
            selectedPersonnel.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-chedBlue font-bold flex items-center justify-center text-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{p.name}</div>
                    <div className="text-2xs uppercase tracking-wider text-slate-500 font-medium">{p.position}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemovePersonnel(idx)}
                  className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
