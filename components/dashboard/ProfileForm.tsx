'use client';

import React, { useState } from 'react';

export default function ProfileForm() {
  // Тимчасовий стейт для демонстрації. В реальному проєкті тут буде React Hook Form + Zod + Supabase
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white border border-brand-brown/10 rounded-2xl overflow-hidden">
      <div className="bg-card-sand px-6 py-4 border-b border-brand-brown/10 flex justify-between items-center">
        <div>
          <h2 className="font-serif font-bold text-brand-brown text-xl">Personal Information</h2>
          <p className="text-sm text-brand-muted">Manage your personal details and preferences.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm font-medium text-brand-brown bg-brand-brown/10 hover:bg-brand-brown hover:text-white px-4 py-2 rounded-full transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">First Name</label>
            <input
              type="text"
              defaultValue="Oleksandr"
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-brand-brown/20 bg-brand-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Last Name</label>
            <input
              type="text"
              defaultValue="Developer"
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-brand-brown/20 bg-brand-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Email Address</label>
            <input
              type="email"
              defaultValue="hello@example.com"
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-brand-brown/20 bg-brand-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">Phone Number</label>
            <input
              type="tel"
              defaultValue="+380 50 123 4567"
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-brand-brown/20 bg-brand-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-brand-brown text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-brown/90 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}