import ProfileForm from '@/components/dashboard/ProfileForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | Coffeo',
  description: 'Manage your Coffeo account details',
};

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">My Profile</h1>
        <p className="text-brand-muted">Welcome back! Here you can manage your account settings.</p>
      </div>

      <ProfileForm />
    </div>
  );
}