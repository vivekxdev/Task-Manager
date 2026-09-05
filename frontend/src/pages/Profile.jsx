import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';
import { KeyIcon, ComputerDesktopIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await dispatch(logout()).unwrap();
        toast.success('Logged out successfully');
      } catch (error) {
        toast.error('Failed to logout');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-neutral-900">Profile & Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your account and security settings.</p>
      </header>

      <section className="card" aria-labelledby="profile-header">
        <div className="card-header pt-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="avatar avatar-xl text-2xl bg-primary-100 text-primary-700 flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 id="profile-header" className="text-xl font-semibold text-neutral-900">{user?.name}</h2>
              <p className="mt-1 text-neutral-500">{user?.email}</p>
              <p className="mt-2 text-sm text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5">
                <UserCircleIcon className="w-4 h-4" aria-hidden="true" />
                Member since {formatMemberSince(user?.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200">
          <nav className="tabs -mb-px" aria-label="Account settings">
            <button
              onClick={() => setActiveTab('profile')}
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            >
              <UserCircleIcon className="w-4 h-4 inline mr-2" aria-hidden="true" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
            >
              <ShieldCheckIcon className="w-4 h-4 inline mr-2" aria-hidden="true" />
              Security
            </button>
          </nav>
        </div>

        <div className="card-body">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  Account Information
                </h3>
                <dl className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <dt className="text-sm font-medium text-neutral-500">Full Name</dt>
                    <dd className="sm:col-span-2 text-sm font-medium text-neutral-900">{user?.name}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <dt className="text-sm font-medium text-neutral-500">Email Address</dt>
                    <dd className="sm:col-span-2 text-sm text-neutral-900">{user?.email}</dd>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <dt className="text-sm font-medium text-neutral-500">Member Since</dt>
                    <dd className="sm:col-span-2 text-sm text-neutral-900">{formatMemberSince(user?.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg">
                    <KeyIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">Password</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      For security reasons, password changes are handled through a separate flow.
                      This feature would typically integrate with a password reset email flow.
                    </p>
                    <button className="btn-secondary" disabled>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-primary-100 rounded-lg">
                      <ComputerDesktopIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-neutral-900 mb-1">Active Sessions</h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Manage your active sessions. This feature would show all devices logged into your account.
                      </p>
                      <button className="btn-secondary" disabled>
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card border-danger-200 bg-danger-50/30" aria-labelledby="danger-zone-header">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger-100 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-danger-600" aria-hidden="true" />
              </div>
              <div>
                <h3 id="danger-zone-header" className="text-lg font-medium text-neutral-900">Danger Zone</h3>
                <p className="mt-1 text-sm text-neutral-500">Sign out of your account. You&apos;ll need to sign in again to access your tasks.</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}