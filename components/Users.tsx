import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Search, MoreVertical, Shield, User as UserIcon } from 'lucide-react';

interface UsersProps {
  users: User[];
  onAddUser: (user: Partial<User>) => void;
}

const Users: React.FC<UsersProps> = ({ users, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Analyst' });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(newUser);
    setShowModal(false);
    setNewUser({ name: '', email: '', role: 'Analyst' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Team Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage access and roles for your team.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search team members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Active</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div>
                      <div className="font-semibold text-invest-900">{user.name}</div>
                      <div className="text-slate-400 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === 'Admin' ? <Shield size={14} className="text-invest-gold" /> : <UserIcon size={14} className="text-slate-400" />}
                    <span className={user.role === 'Admin' ? 'text-invest-900 font-medium' : 'text-slate-600'}>{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-invest-900 rounded hover:bg-slate-100">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Add New Team Member</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                  <option value="Analyst">Analyst</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
