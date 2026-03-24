'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

type Subject = 'chemistry' | 'physics' | 'mathematics';
type RoleType = 'super_admin' | 'subject_admin' | 'viewer';

interface UserRole {
  _id: string;
  email: string;
  role: RoleType;
  subjects: Subject[];
  granted_by: string;
  granted_at: string;
  last_accessed_at?: string;
  is_active: boolean;
  notes?: string;
}

interface RoleManagementProps {
  currentUserEmail: string;
}

export default function RoleManagement({ currentUserEmail }: RoleManagementProps) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'subject_admin' as RoleType,
    subjects: [] as Subject[],
    notes: '',
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v2/admin/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data.roles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/v2/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save role');
      }

      setSuccess('Role saved successfully');
      setShowAddForm(false);
      setFormData({ email: '', role: 'subject_admin', subjects: [], notes: '' });
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove access for ${email}?`)) return;

    try {
      const response = await fetch(`/api/v2/admin/roles?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete role');
      }

      setSuccess('Role removed successfully');
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleSubject = (subject: Subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const getRoleBadge = (role: RoleType) => {
    const styles = {
      super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      subject_admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return styles[role];
  };

  const getSubjectBadge = (subject: Subject) => {
    const styles = {
      chemistry: 'bg-green-500/20 text-green-400 border-green-500/30',
      physics: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      mathematics: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return styles[subject];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Role Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType, subjects: e.target.value === 'super_admin' ? [] : formData.subjects })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="subject_admin">Subject Admin (can edit questions)</option>
              <option value="super_admin">Super Admin (full access)</option>
              <option value="viewer">Viewer (read-only)</option>
            </select>
          </div>

          {formData.role !== 'super_admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subjects {formData.role === 'subject_admin' && <span className="text-red-400">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['chemistry', 'physics', 'mathematics'] as Subject[]).map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                      formData.subjects.includes(subject)
                        ? getSubjectBadge(subject)
                        : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
              placeholder="e.g., Math faculty member"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Role
          </button>
        </form>
      )}

      {/* Roles List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading roles...</div>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <div
              key={role._id}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-medium">{role.email}</span>
                    <span className={`px-2 py-1 text-xs rounded border ${getRoleBadge(role.role)}`}>
                      {role.role.replace('_', ' ')}
                    </span>
                    {role.email === currentUserEmail && (
                      <span className="px-2 py-1 text-xs rounded border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        You
                      </span>
                    )}
                  </div>
                  
                  {role.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {role.subjects.map((subject) => (
                        <span key={subject} className={`px-2 py-1 text-xs rounded border capitalize ${getSubjectBadge(subject)}`}>
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {role.notes && (
                    <p className="text-sm text-gray-400 mb-2">{role.notes}</p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Granted by {role.granted_by} on {new Date(role.granted_at).toLocaleDateString()}
                    {role.last_accessed_at && ` • Last active: ${new Date(role.last_accessed_at).toLocaleDateString()}`}
                  </div>
                </div>
                
                {role.email !== currentUserEmail && (
                  <button
                    onClick={() => handleDelete(role.email)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {roles.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No roles configured. Add users to grant them access.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
