"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProductTab from "@/components/dashboard/products/ProductTab";
import DashboardStats, {
  DashboardOverviewStats,
} from "@/components/dashboard/DashboardStats";
import DashboardTabs from "@/components/dashboard/layout/DashboardTabs";
import OrdersList from "@/components/dashboard/OrdersList";
import { AuthContext } from "@/components/providers/AuthProvider";
import { useDispatch } from "react-redux";
import { setProducts } from "@/store/products/productSlice";
import { ProductsType } from "@/types/products.types";
import { Order } from "@/types/orders.types";
import { DASHBOARD_TABS } from "@/lib/data/dashboard.data";

const EMPTY_OVERVIEW: DashboardOverviewStats = {
  totalSpent: 0,
  totalOrders: 0,
  cartItemCount: 0,
  recentOrders: [],
};

interface DashboardPageInterface {
  productsData: ProductsType[];
  isAdmin: boolean;
  initialTab?: string;
  overview?: DashboardOverviewStats;
  orders?: Order[];
}

export default function DashboardPage(props: DashboardPageInterface) {
  return <DashboardPageContent key={props.initialTab ?? "overview"} {...props} />;
}

function DashboardPageContent({
  productsData,
  isAdmin,
  initialTab = "overview",
  overview = EMPTY_OVERVIEW,
  orders = [],
}: DashboardPageInterface) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const authData = useContext(AuthContext);
  const user = authData?.user ?? null;
  const admin = isAdmin || user?.role === "Admin";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    dispatch(setProducts(productsData));
  }, [productsData, dispatch]);

  const tabs = DASHBOARD_TABS.filter((tab) => tab.id !== "products" || admin);

  const handleTabChange = (tabId: string) => {
    if (tabId === "products") {
      router.push("/dashboard/products");
      return;
    }
    if (pathname === "/dashboard/products") {
      router.push("/dashboard");
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-brown mb-2">
          Dashboard
        </h1>

        <p className="text-brand-muted">
          Manage products, orders, customers and analytics.
        </p>
      </div>

      <DashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      <div className="min-h-[400px]">
        {activeTab === "overview" && <DashboardStats {...overview} />}

        {activeTab === "products" && admin && <ProductTab />}

        {activeTab === "orders" && <OrdersList orders={orders} />}

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
