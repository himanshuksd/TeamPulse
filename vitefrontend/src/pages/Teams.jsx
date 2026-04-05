import { useEffect, useState } from 'react';
import { useTeam } from '../context/TeamContext';
import api from '../services/api';
import {
  Plus, RefreshCw, Users, Trash2, LogOut,
  X, UserPlus, Copy, Check, Crown,
  Calendar, Search, Link, UserMinus,
} from 'lucide-react';

function nameColor(str = '') {
  const palette = ['#4F81C7', '#9B59B6', '#27AE60', '#E67E22', '#E74C3C', '#1ABC9C', '#2980B9'];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

function Avatar({ name = '?', size = 10, className = '' }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
      style={{ width: size * 4, height: size * 4, fontSize: size * 1.4, background: nameColor(name) }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function Teams() {
  const { activeTeamId, setActiveTeamId } = useTeam();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [creatingTeam, setCreatingTeam] = useState(false);

  const [modalTeam, setModalTeam] = useState(null);
  const [modalMembers, setModalMembers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ FIX: your auth.js saves { id, name, email } under key "user"
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id || 0;

  useEffect(() => { fetchTeams(); }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const teamsRes = await api.get('/teams');
      const rawTeams = teamsRes.data;

      const enriched = await Promise.all(
        rawTeams.map(async (team) => {
          try {
            const membersRes = await api.get(`/teams/${team.id}/members`);
            const members = membersRes.data;
            // ✅ FIX: compare with correct currentUserId from "user" key
            const me = members.find(m => m.user_id === currentUserId);
            return {
              ...team,
              memberCount: members.length,
              myRole: me?.role || 'member',
              membersPreview: members,
            };
          } catch {
            return { ...team, memberCount: 0, myRole: 'member', membersPreview: [] };
          }
        })
      );
      setTeams(enriched);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    setCreatingTeam(true);
    try {
      await api.post('/teams', { name: newTeamName.trim() });
      setNewTeamName(''); setShowNewTeam(false);
      await fetchTeams();
    } catch (err) { console.error(err); }
    finally { setCreatingTeam(false); }
  };

  const handleDeleteTeam = async (teamId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this team? This cannot be undone.')) return;
    try {
      await api.delete(`/teams/${teamId}`);
      if (parseInt(activeTeamId) === teamId) setActiveTeamId(null);
      await fetchTeams();
    } catch (err) { alert(err?.response?.data?.detail || 'Failed to delete team.'); }
  };

  const handleLeaveTeam = async (teamId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Leave this team?')) return;
    try {
      await api.post(`/teams/${teamId}/leave`);
      if (parseInt(activeTeamId) === teamId) setActiveTeamId(null);
      await fetchTeams();
    } catch (err) { alert(err?.response?.data?.detail || 'Cannot leave team.'); }
  };

  const openModal = async (team) => {
    setModalTeam(team);
    setAddEmail(''); setAddError(''); setAddSuccess('');
    setInviteLink(''); setCopied(false);
    setModalMembers(team.membersPreview || []);
    setModalLoading(true);
    try {
      const res = await api.get(`/teams/${team.id}/members`);
      setModalMembers(res.data);
    } catch { }
    finally { setModalLoading(false); }
  };

  const closeModal = () => {
    setModalTeam(null); setModalMembers([]);
    setInviteLink(''); setAddEmail(''); setAddError(''); setAddSuccess('');
  };

  const handleAddMember = async () => {
    if (!addEmail.trim()) return;
    setAddLoading(true); setAddError(''); setAddSuccess('');
    try {
      const userRes = await api.get(`/users/search?email=${encodeURIComponent(addEmail.trim())}`);
      const foundUser = userRes.data;
      await api.post(`/teams/${modalTeam.id}/add-member`, { user_id: foundUser.id });
      setAddSuccess(`${foundUser.name} added successfully!`);
      setAddEmail('');
      const membersRes = await api.get(`/teams/${modalTeam.id}/members`);
      setModalMembers(membersRes.data);
      setTeams(prev => prev.map(t =>
        t.id === modalTeam.id
          ? { ...t, memberCount: membersRes.data.length, membersPreview: membersRes.data }
          : t
      ));
    } catch (err) {
      setAddError(err?.response?.data?.detail || 'User not found or already a member.');
    } finally { setAddLoading(false); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    setRemovingId(userId);
    try {
      await api.delete(`/teams/${modalTeam.id}/members/${userId}`);
      const updated = modalMembers.filter(m => m.user_id !== userId);
      setModalMembers(updated);
      setTeams(prev => prev.map(t =>
        t.id === modalTeam.id
          ? { ...t, memberCount: updated.length, membersPreview: updated }
          : t
      ));
    } catch (err) { alert(err?.response?.data?.detail || 'Failed to remove member.'); }
    finally { setRemovingId(null); }
  };

  const handleGenerateInvite = async () => {
    setInviteLoading(true);
    try {
      const res = await api.post(`/teams/${modalTeam.id}/invite`);
      setInviteLink(`${window.location.origin}/join/${res.data.invite_token}`);
    } catch { alert('Failed to generate invite link.'); }
    finally { setInviteLoading(false); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isAdmin = (team) => team.myRole === 'admin';

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Teams</h1>
          <p className="text-sm text-gray-500 mt-1">
            {teams.length} team{teams.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchTeams} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowNewTeam(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> New Team
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search teams..."
          className="w-full max-w-sm pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
      </div>

      {/* New Team Form */}
      {showNewTeam && (
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Create New Team</h3>
          <div className="flex gap-3">
            <input autoFocus value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateTeam(); if (e.key === 'Escape') setShowNewTeam(false); }}
              placeholder="Team name..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button onClick={handleCreateTeam} disabled={creatingTeam || !newTeamName.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
              {creatingTeam ? 'Creating…' : 'Create'}
            </button>
            <button onClick={() => setShowNewTeam(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {searchQuery ? 'No teams match your search.' : 'No teams yet. Create your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(team => {
            const active = parseInt(activeTeamId) === team.id;
            const admin = isAdmin(team);
            const memberCount = team.memberCount ?? 0;
            const preview = team.membersPreview || [];

            return (
              <div key={team.id} onClick={() => openModal(team)}
                className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md group ${active ? 'border-blue-400 shadow-md shadow-blue-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>

                <div className="flex items-start justify-between mb-4">
                  <Avatar name={team.name} size={10} />
                  <div className="flex items-center gap-1.5">
                    {active && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">★ Active</span>
                    )}
                    {admin ? (
                      <button onClick={e => handleDeleteTeam(team.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete team">
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <button onClick={e => handleLeaveTeam(team.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Leave team">
                        <LogOut size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-0.5 ${active ? 'text-blue-700' : 'text-gray-900'}`}>{team.name}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {/* ✅ Now correctly shows "You are admin" for team creators */}
                  {admin ? 'You are admin' : 'Member'}{' · '}
                  <span className="font-bold text-gray-800">{memberCount}</span> member{memberCount !== 1 ? 's' : ''}
                </p>

                {preview.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {preview.slice(0, 5).map((m, i) => (
                        <div key={m.user_id} title={m.name}
                          className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white font-bold"
                          style={{ fontSize: 9, background: nameColor(m.name), zIndex: 10 - i }}>
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                      ))}
                      {memberCount > 5 && (
                        <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
                          +{memberCount - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />
                    {new Date(team.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    {!active && (
                      <button onClick={e => { e.stopPropagation(); setActiveTeamId(team.id); }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                        Set Active
                      </button>
                    )}
                    {admin && <span className="flex items-center gap-1 text-xs text-purple-500 font-semibold"><Users size={11} /> Manage</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Member Modal ── */}
      {modalTeam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={modalTeam.name} size={9} />
                <div>
                  <h2 className="text-base font-extrabold text-gray-900">{modalTeam.name}</h2>
                  <p className="text-xs text-gray-400">{modalMembers.length} member{modalMembers.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">

              {/* Member list */}
              <div className="px-6 pt-5 pb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Members ({modalMembers.length})
                </h3>
                {modalLoading && modalMembers.length === 0 ? (
                  <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>
                ) : modalMembers.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No members found.</p>
                ) : (
                  <div className="space-y-1">
                    {modalMembers.map(member => {
                      const isMe = member.user_id === currentUserId;
                      const isAdminMember = member.role === 'admin';
                      const amIAdmin = isAdmin(modalTeam);
                      return (
                        <div key={member.user_id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 group/member transition-colors">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ fontSize: 11, background: nameColor(member.name) }}>
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                              {isMe && <span className="text-[10px] text-blue-500 font-bold">(you)</span>}
                              {isAdminMember && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                                  <Crown size={9} /> Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{member.email}</p>
                            {member.joined_at && (
                              <p className="text-[10px] text-gray-300 mt-0.5">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                            )}
                          </div>
                          {amIAdmin && !isMe && !isAdminMember && (
                            <button onClick={() => handleRemoveMember(member.user_id)} disabled={removingId === member.user_id}
                              className="opacity-0 group-hover/member:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                              {removingId === member.user_id
                                ? <div className="w-3.5 h-3.5 border border-red-300 border-t-transparent rounded-full animate-spin" />
                                : <UserMinus size={14} />}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ✅ Add Member — only visible when you are admin */}
              {isAdmin(modalTeam) && (
                <div className="px-6 py-4 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <UserPlus size={12} /> Add Member by Email
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-2">Person must already have a TeamPulse account.</p>
                  <div className="flex gap-2">
                    <input value={addEmail} type="email" placeholder="their@email.com"
                      onChange={e => { setAddEmail(e.target.value); setAddError(''); setAddSuccess(''); }}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddMember(); }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                    <button onClick={handleAddMember} disabled={addLoading || !addEmail.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5">
                      {addLoading ? <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" /> : <UserPlus size={13} />} Add
                    </button>
                  </div>
                  {addError && <p className="text-xs text-red-500 mt-2">{addError}</p>}
                  {addSuccess && <p className="text-xs text-green-600 mt-2 font-medium">✓ {addSuccess}</p>}
                </div>
              )}

              {/* ✅ Invite Link — only visible when you are admin */}
              {isAdmin(modalTeam) && (
                <div className="px-6 py-4 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Link size={12} /> Invite Link
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-3">Share this link — anyone can join even without an account.</p>
                  {!inviteLink ? (
                    <button onClick={handleGenerateInvite} disabled={inviteLoading}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-500 hover:text-blue-600 font-medium py-3 rounded-xl transition-all">
                      {inviteLoading ? <span className="w-4 h-4 border border-blue-400 border-t-transparent rounded-full animate-spin" /> : <Link size={15} />}
                      {inviteLoading ? 'Generating…' : 'Generate Invite Link'}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input readOnly value={inviteLink}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-mono truncate" />
                        <button onClick={handleCopyLink}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                            }`}>
                          {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">They'll log in or register first, then automatically join.</p>
                      <button onClick={handleGenerateInvite} className="text-xs text-blue-500 hover:underline">Generate new link</button>
                    </div>
                  )}
                </div>
              )}

              {/* Leave — non-admin only */}
              {!isAdmin(modalTeam) && (
                <div className="px-6 py-4 border-t border-gray-50">
                  <button onClick={() => { closeModal(); handleLeaveTeam(modalTeam.id); }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 border border-red-100 py-2.5 rounded-xl transition-colors font-medium">
                    <LogOut size={14} /> Leave Team
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}