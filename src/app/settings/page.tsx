"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState<any>(null);

  // Account
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [availability, setAvailability] = useState('available');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    email_messages: true, email_orders: true, email_marketing: false,
    push_messages: true, push_orders: true, sms_orders: false,
  });

  // Security
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (p) {
        setName(p.name ?? '');
        setBio(p.bio ?? '');
        setLocation(p.location ?? '');
        setSkills((p.skills ?? []).join(', '));
        setWebsite(p.website ?? '');
        setTwitter(p.twitter ?? '');
        setInstagram(p.instagram ?? '');
        setYoutube(p.youtube ?? '');
        setAvailability(p.availability ?? 'available');
        setAvatarUrl(p.avatar_url ?? null);
        if (p.notifications) setNotifs({ ...notifs, ...p.notifications });
      }
      setLoading(false);
    };
    load();
  }, []);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      name, bio, location,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      initials: name.slice(0, 2).toUpperCase(),
      website, twitter, instagram, youtube, availability,
    }).eq('id', user.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : '✅ Profile saved!');
  };

  const saveNotifs = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ notifications: notifs }).eq('id', user.id);
    setSaving(false);
    flash('✅ Notification preferences saved!');
  };

  const changePassword = async () => {
    setPwError(''); setPwSuccess('');
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    if (error) setPwError(error.message);
    else { setPwSuccess('Password updated!'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setSaving(true);
    
    try {
      // 1. Delete associated data (Gigs & Profile)
      await supabase.from('gigs').delete().eq('creator_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // 2. TRIGGER TOTAL PURGE (Delete Auth Account)
      const { error: rpcError } = await supabase.rpc('delete_user_permanently');
      
      if (rpcError) {
        console.error('RPC Purge Failed:', rpcError);
        alert(`SECURITY BLOCK: ${rpcError.message}\n\nThis usually means you haven't run the SQL script in Supabase yet!`);
        setSaving(false);
        return;
      }

      // 3. Force Sign out and redirect
      await supabase.auth.signOut();
      router.push('/');
      
      flash('✅ Account permanently decommissioned.');
    } catch (err) {
      console.error('Delete error:', err);
      flash('❌ Error during account deletion.');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      setAvatarUrl(publicUrl);
      flash('✅ Avatar updated!');
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message?.includes('bucket')) {
        flash('❌ Error: Supabase Storage bucket "avatars" not found. Please create it in your dashboard.');
      } else {
        flash(`❌ Backend Error: ${error.message || 'Check Supabase configuration'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div className={`toggle-switch ${active ? 'active' : ''}`} onClick={onToggle} />
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--color-primary)' }}></i>
    </div>
  );

  const tabs = [
    { id: 'account', icon: 'fa-user', label: 'Account' },
    { id: 'security', icon: 'fa-shield-halved', label: 'Security' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications' },
    { id: 'billing', icon: 'fa-credit-card', label: 'Billing' },
    { id: 'privacy', icon: 'fa-eye-slash', label: 'Privacy' },
  ];

  return (
    <div className="container settings-layout">
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '90px', right: '30px', zIndex: 3000, background: toast.includes('Error') ? 'var(--color-danger)' : 'var(--color-success)', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: 600, boxShadow: 'var(--shadow-card)', animation: 'fadeIn 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Sidebar Nav */}
      <aside>
        <div className="settings-nav">
          {tabs.map(t => (
            <div key={t.id} className={`settings-nav-link ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className={`fa-solid ${t.icon}`} style={{ width: '18px', textAlign: 'center' }}></i> {t.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--border-radius)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-danger)', fontWeight: 600, marginBottom: '5px' }}>Danger Zone</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Delete your account permanently</div>
          <button className="btn" style={{ marginTop: '10px', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 14px', fontSize: '0.8rem', width: '100%' }} onClick={() => setActiveTab('delete')}>Delete Account</button>
        </div>
      </aside>

      {/* Content Panels */}
      <main>
        {/* ===== ACCOUNT ===== */}
        {activeTab === 'account' && (
          <div>
            <h2 style={{ marginBottom: '5px' }}>Account Settings</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Update your personal info and public profile.</p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)', display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, border: '4px solid #1E2532', overflow: 'hidden', color: 'white' }}>
                  {!avatarUrl && name.slice(0, 2).toUpperCase()}
                </div>
                <label style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', background: '#818cf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0A0D14', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={uploadAvatar} disabled={uploading} />
                  <i className={uploading ? "fa-solid fa-circle-notch fa-spin fa-xs" : "fa-solid fa-camera fa-xs"}></i>
                </label>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '4px' }}>{name || 'Creator Name'}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Avatar format: JPG, PNG, WEBP (Max 2MB)</p>
                {uploading && <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '4px', fontWeight: 700 }}>UPLOADING...</div>}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Personal Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email</label>
                  <input className="form-control" value={user?.email ?? ''} disabled style={{ opacity: 0.6 }} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Bio</label>
                <textarea className="form-control" rows={3} placeholder="Tell us about yourself..." value={bio} onChange={e => setBio(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Location</label>
                  <input className="form-control" placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Availability</label>
                  <select className="form-control" value={availability} onChange={e => setAvailability(e.target.value)}>
                    <option value="available">🟢 Available for Work</option>
                    <option value="busy">🟡 Busy — Limited</option>
                    <option value="unavailable">🔴 Not Available</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Skills & Expertise</h4>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Skills <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(comma-separated)</span></label>
                <input className="form-control" placeholder="Premiere Pro, DaVinci Resolve, After Effects..." value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
              {skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="skill-chip">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Social Links</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label><i className="fa-solid fa-globe" style={{ marginRight: '6px' }}></i>Website</label>
                  <input className="form-control" placeholder="https://yoursite.com" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label><i className="fa-brands fa-twitter" style={{ marginRight: '6px' }}></i>Twitter</label>
                  <input className="form-control" placeholder="@handle" value={twitter} onChange={e => setTwitter(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label><i className="fa-brands fa-instagram" style={{ marginRight: '6px' }}></i>Instagram</label>
                  <input className="form-control" placeholder="@handle" value={instagram} onChange={e => setInstagram(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label><i className="fa-brands fa-youtube" style={{ marginRight: '6px' }}></i>YouTube</label>
                  <input className="form-control" placeholder="Channel URL" value={youtube} onChange={e => setYoutube(e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" style={{ padding: '14px 40px' }} onClick={saveProfile} disabled={saving}>
                {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ===== SECURITY ===== */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ marginBottom: '5px' }}>Security</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Manage your password and account security.</p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Change Password</h4>
              {pwError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: 'var(--color-danger)', fontSize: '0.9rem' }}><i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{pwError}</div>}
              {pwSuccess && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: 'var(--color-success)', fontSize: '0.9rem' }}><i className="fa-solid fa-check-circle" style={{ marginRight: '8px' }}></i>{pwSuccess}</div>}
              <div className="form-group"><label>Current Password</label><input type="password" className="form-control" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" /></div>
              <div className="form-group"><label>New Password</label><input type="password" className="form-control" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" /></div>
              <div className="form-group"><label>Confirm New Password</label><input type="password" className="form-control" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter new password" /></div>
              <button className="btn btn-primary" onClick={changePassword} disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
            </div>

            <div className="glass-card" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Active Sessions</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <i className="fa-solid fa-desktop" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Current Session</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>This browser • Active now</div>
                </div>
                <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--color-success)', border: '1px solid rgba(16,185,129,0.3)' }}>Active</span>
              </div>
            </div>
          </div>
        )}

        {/* ===== NOTIFICATIONS ===== */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ marginBottom: '5px' }}>Notifications</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Choose how you want to be notified.</p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--color-primary-light)' }}>Email Notifications</h4>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>New Messages</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Get emailed when someone messages you</div></div><Toggle active={notifs.email_messages} onToggle={() => setNotifs(p => ({ ...p, email_messages: !p.email_messages }))} /></div>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>Order Updates</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Notifications about your orders</div></div><Toggle active={notifs.email_orders} onToggle={() => setNotifs(p => ({ ...p, email_orders: !p.email_orders }))} /></div>
              <div className="setting-row" style={{ borderBottom: 'none' }}><div><div style={{ fontWeight: 600 }}>Marketing & Tips</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Platform updates and tips</div></div><Toggle active={notifs.email_marketing} onToggle={() => setNotifs(p => ({ ...p, email_marketing: !p.email_marketing }))} /></div>
            </div>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--color-primary-light)' }}>Push & SMS</h4>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>Push — Messages</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Browser push for new chats</div></div><Toggle active={notifs.push_messages} onToggle={() => setNotifs(p => ({ ...p, push_messages: !p.push_messages }))} /></div>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>Push — Orders</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Push when order status changes</div></div><Toggle active={notifs.push_orders} onToggle={() => setNotifs(p => ({ ...p, push_orders: !p.push_orders }))} /></div>
              <div className="setting-row" style={{ borderBottom: 'none' }}><div><div style={{ fontWeight: 600 }}>SMS — Orders</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Text messages for urgent order updates</div></div><Toggle active={notifs.sms_orders} onToggle={() => setNotifs(p => ({ ...p, sms_orders: !p.sms_orders }))} /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" style={{ padding: '14px 40px' }} onClick={saveNotifs} disabled={saving}>{saving ? 'Saving...' : 'Save Preferences'}</button>
            </div>
          </div>
        )}

        {/* ===== BILLING ===== */}
        {activeTab === 'billing' && (
          <div>
            <h2 style={{ marginBottom: '5px' }}>Billing & Payments</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Manage payment methods and view transaction history.</p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Payment Methods</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)', marginBottom: '15px' }}>
                <i className="fa-brands fa-cc-visa" style={{ fontSize: '2rem', color: '#1A1F71' }}></i>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>Visa ending in •••• 4242</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Expires 12/27</div></div>
                <span className="badge" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--color-primary-light)', border: '1px solid rgba(139,92,246,0.3)' }}>Default</span>
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }}><i className="fa-solid fa-plus"></i> Add Payment Method</button>
            </div>

            <div className="glass-card" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Transaction History</h4>
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                <i className="fa-solid fa-receipt fa-2x" style={{ marginBottom: '12px', opacity: 0.3 }}></i>
                <p>No transactions yet.</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== PRIVACY ===== */}
        {activeTab === 'privacy' && (
          <div>
            <h2 style={{ marginBottom: '5px' }}>Privacy</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>Control who can see your information.</p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '15px', color: 'var(--color-primary-light)' }}>Profile Visibility</h4>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>Show Online Status</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Let others see when you're online</div></div><Toggle active={true} onToggle={() => {}} /></div>
              <div className="setting-row"><div><div style={{ fontWeight: 600 }}>Show Earnings</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Display earnings on your profile</div></div><Toggle active={false} onToggle={() => {}} /></div>
              <div className="setting-row" style={{ borderBottom: 'none' }}><div><div style={{ fontWeight: 600 }}>Allow Messages from Anyone</div><div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>If off, only clients with orders can message</div></div><Toggle active={true} onToggle={() => {}} /></div>
            </div>

            <div className="glass-card" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--color-primary-light)' }}>Data & Export</h4>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '15px', fontSize: '0.9rem' }}>Download a copy of all your data.</p>
              <button className="btn btn-outline"><i className="fa-solid fa-download"></i> Request Data Export</button>
            </div>
          </div>
        )}

        {/* ===== DELETE ACCOUNT ===== */}
        {activeTab === 'delete' && (
          <div>
            <h2 style={{ marginBottom: '5px', color: 'var(--color-danger)' }}>Delete Account</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>This action is permanent and cannot be undone.</p>

            <div className="glass-card" style={{ padding: '30px', borderRadius: 'var(--border-radius-lg)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ background: 'rgba(239,68,68,0.05)', padding: '20px', borderRadius: '10px', marginBottom: '25px' }}>
                <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: '10px' }}><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>Warning</p>
                <ul style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', paddingLeft: '18px', lineHeight: 1.8 }}>
                  <li>All your gigs will be permanently removed</li>
                  <li>Active orders will be cancelled</li>
                  <li>Your profile and reviews will be deleted</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
              <div className="form-group">
                <label>Type <strong>DELETE</strong> to confirm</label>
                <input className="form-control" placeholder="DELETE" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} />
              </div>
              <button className="btn" style={{ background: 'var(--color-danger)', color: 'white', padding: '14px 30px' }} disabled={deleteConfirm !== 'DELETE'} onClick={deleteAccount}>
                <i className="fa-solid fa-trash"></i> Permanently Delete Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
