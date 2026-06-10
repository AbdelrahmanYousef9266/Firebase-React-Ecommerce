import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import {
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '../firebase/users';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isNewProfile, setIsNewProfile] = useState(false);

  // Depend on user.uid (stable string) — not the user object itself.
  // Firebase replaces the user object on every token refresh, which
  // previously re-ran this effect and triggered a second fetch that
  // could overwrite a clean success state with an error.
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    setError('');   // always clear before fetching
    setSuccess('');

    console.time('PROFILE_FETCH');

    fetchUserProfile(user.uid)
      .then((data) => {
        console.timeEnd('PROFILE_FETCH');
        if (data) {
          setForm({ name: data.name || '', address: data.address || '' });
          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
        }
      })
      .catch((err) => {
        console.timeEnd('PROFILE_FETCH');
        console.error('[Profile] Firestore fetch failed:', err.code, err.message);
        setError('Failed to load profile. Check Firestore rules or your connection.');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateUserProfile(user.uid, {
        name: form.name.trim(),
        address: form.address.trim(),
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Check your Firestore rules.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('cart');
    navigate('/');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.'))
      return;
    try {
      await deleteUserProfile(user.uid);
      await deleteUser(user);
      sessionStorage.removeItem('cart');
      navigate('/register');
    } catch (err) {
      console.error('[Profile] Delete account failed:', err.code, err.message);
      setError('Could not delete account. Please log out, log back in, then try again.');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="profile-title">My Profile</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {isNewProfile && !success && (
          <div className="profile-info">
            No profile found. Fill in your details below and click Save.
          </div>
        )}
        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Your delivery address"
              rows={3}
            />
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button className="delete-account-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
