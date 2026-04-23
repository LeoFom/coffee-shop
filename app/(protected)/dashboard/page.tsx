import DashboardStats from '@/components/dashboard/DashboardStats';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Coffeo',
  description: 'Your personal Coffeo dashboard and statistics',
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Overview</h1>
        <p className="text-brand-muted">Track your activity, orders, and viewing history.</p>
      </div>

      <DashboardStats />
    </div>
  );
}