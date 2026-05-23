"use client";

import DashboardInput from "@/components/dashboard/ui/DashboardInput";
import DashboardSelect from "@/components/dashboard/ui/DashboardSelect";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";

interface ProductToolbarProps {
  onCreate: () => void;
}

export default function ProductToolbar({
 onCreate,
}: ProductToolbarProps) {
  return (
    <div className="sticky top-4 z-20">
      <div className="bg-white border border-brand-brown/10 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

          <div className="flex flex-col lg:flex-row gap-3 flex-1">
            <DashboardInput
              placeholder="Search products..."
              className="lg:max-w-sm"
            />

            <DashboardSelect className="lg:w-48">
              <option>All Categories</option>
              <option>Coffee</option>
              <option>Equipment</option>
              <option>Merchandise</option>
            </DashboardSelect>

            <DashboardSelect className="lg:w-40">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </DashboardSelect>

            <DashboardSelect className="lg:w-48">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </DashboardSelect>
          </div>

          <DashboardButton onClick={onCreate}>
            + Add Product
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}