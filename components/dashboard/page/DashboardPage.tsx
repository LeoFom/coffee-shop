"use client";

import {useContext, useEffect, useState} from "react";

import ProductTab from "@/components/dashboard/products/ProductTab";
import DashboardStats from "@/components/dashboard/DashboardStats";

import DashboardTabs from "@/components/dashboard/layout/DashboardTabs";
import DashboardButton from "@/dashboard/ui/DashboardButton";
import {AuthContext} from "@/components/providers/AuthProvider";
import {DASHBOARD_TABS} from "@/dashboard/data/dashboardData";
import {useDispatch} from "react-redux";
import {setProducts} from "@/store/products/productSlice";
import {DashboardProductsType} from "@/types/products";

interface DashboardPageInterface {
  productsData: DashboardProductsType[];
}

export default function DashboardPage({productsData}: DashboardPageInterface) {
  const dispatch = useDispatch();
  const authData = useContext(AuthContext);
  const user = authData?.user ?? null

  console.log("(DashboardPage) -> user",user)

  const [activeTab, setActiveTab] =
    useState("overview");

  const handleFetchProducts = async () => {
    try{
      const res = await fetch('/api/products',{
        method: "GET",
      })
      const data = await res.json()
      console.log("[DashboardPage] fetch - res",res)
      console.log("[DashboardPage] fetch - data",data)
    } catch (error) {
      console.log(error)
      console.error(error)
    }
  }

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