'use client';

import React from 'react';

// Мокові дані для статистики
const MOCK_STATS = [
  { id: 1, label: 'Total Spent', value: '$342.50', trend: '+12%', isPositive: true },
  { id: 2, label: 'Total Orders', value: '14', trend: '+2', isPositive: true },
  { id: 3, label: 'Products Viewed', value: '128', trend: '+15%', isPositive: true },
  { id: 4, label: 'Saved to Cart', value: '3', trend: '-1', isPositive: false },
];

const MOCK_RECENT_ACTIVITY = [
  { id: 1, action: 'Viewed Product', target: 'Ethiopia Yirgacheffe', time: '2 hours ago' },
  { id: 2, action: 'Added to Cart', target: 'Hario V60 Dripper', time: '5 hours ago' },
  { id: 3, action: 'Completed Order', target: '#ORD-2026-102', time: '2 days ago' },
  { id: 4, action: 'Viewed Category', target: 'Equipment', time: '3 days ago' },
];

export default function DashboardStats() {
  return (
    <div className="space-y-6">
      {/* Картки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-2xl border border-brand-brown/10 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-brand-muted mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-serif font-bold text-brand-brown">{stat.value}</h3>
              <span className={`text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Останні дії користувача (Activity Feed) */}
      <div className="bg-white rounded-2xl border border-brand-brown/10 overflow-hidden shadow-sm">
        <div className="bg-card-sand px-6 py-4 border-b border-brand-brown/10">
          <h3 className="font-serif font-bold text-brand-brown text-lg">Recent Activity</h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {MOCK_RECENT_ACTIVITY.map((activity, index) => (
              <li key={activity.id} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-brand-text text-sm">
                    <span className="font-medium">{activity.action}</span>: {activity.target}
                  </p>
                </div>
                <div className="text-xs text-brand-muted whitespace-nowrap">
                  {activity.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}