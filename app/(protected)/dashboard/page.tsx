"use client";
//
// export const metadata: Metadata = {
//   title: 'Dashboard | Coffeo',
//   description: 'Your personal Coffeo dashboard and statistics',
// };

import { useState } from "react";

import ProductPage from "@/components/dashboard/products/ProductPage";
import DashboardStats from "@/components/dashboard/DashboardStats";

import DashboardTabs, {
  DashboardTab,
} from "@/components/dashboard/layout/DashboardTabs";
import DashboardButton from "@/dashboard/ui/DashboardButton";

const DASHBOARD_TABS: DashboardTab[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "products",
    label: "Products",
  },
  {
    id: "orders",
    label: "Orders",
  },
  {
    id: "customers",
    label: "Customers",
  },
  {
    id: "analytics",
    label: "Analytics",
  },
  {
    id: "activity",
    label: "Activity",
  },
  {
    id: "newsletter",
    label: "Newsletter",
  },
  {
    id: "settings",
    label: "Settings",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] =
    useState("overview");

  const handleFetchProducts = async () => {
    try{
      const res = await fetch('/api/products',{
        method: "GET",
      })
      const data = await res.json()
      console.log("data",data)
    } catch (error) {
      console.log(error)
      console.error(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-brown mb-2">
          Dashboard
        </h1>

        <p className="text-brand-muted">
          Manage products, orders, customers and analytics.
        </p>
      </div>

      <DashboardButton onClick={handleFetchProducts}>
        + Add Product
      </DashboardButton>

      {/* Tabs */}
      <DashboardTabs
        tabs={DASHBOARD_TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Content */}
      <div className="min-h-[400px]">

        {activeTab === "overview" && (
          <DashboardStats />
        )}

        {activeTab === "products" && (
          <ProductPage />
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-brand-brown/10 p-10">
            <h2 className="text-2xl font-serif font-bold text-brand-brown mb-2">
              Orders
            </h2>

            <p className="text-brand-muted">
              Orders management coming soon.
            </p>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-white rounded-2xl border border-brand-brown/10 p-10">
            <h2 className="text-2xl font-serif font-bold text-brand-brown mb-2">
              Customers
            </h2>

            <p className="text-brand-muted">
              Customers management coming soon.
            </p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-2xl border border-brand-brown/10 p-10">
            <h2 className="text-2xl font-serif font-bold text-brand-brown mb-2">
              Analytics
            </h2>

            <p className="text-brand-muted">
              Analytics dashboard coming soon.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}