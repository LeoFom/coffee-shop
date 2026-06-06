"use client";

import {useContext, useEffect, useState} from "react";

import ProductTab from "@/components/dashboard/products/ProductTab";
import DashboardStats from "@/components/dashboard/DashboardStats";

import DashboardTabs from "@/components/dashboard/layout/DashboardTabs";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useDispatch} from "react-redux";
import {setProducts} from "@/store/products/productSlice";
import {ProductsType} from "@/types/products.types";
import {DASHBOARD_TABS} from "@/lib/data/dashboard.data";

interface DashboardPageInterface {
  productsData: ProductsType[];
}

export default function DashboardPage({productsData}: DashboardPageInterface) {
  const dispatch = useDispatch();
  const authData = useContext(AuthContext);
  const user = authData?.user ?? null

  console.log("(DashboardPage) -> user",user)

  const [activeTab, setActiveTab] =
    useState("overview");

  useEffect(() => {
    dispatch(setProducts(productsData));
  }, [productsData, dispatch]);

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
          <ProductTab/>
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