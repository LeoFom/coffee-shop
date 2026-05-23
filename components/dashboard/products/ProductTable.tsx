"use client";

import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import DashboardBadge from "@/components/dashboard/ui/DashboardBadge";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Ethiopian Beans",
    category: "Coffee",
    price: 24.99,
    isActive: true,
    discount: 15,
    createdAt: "May 20, 2026",
  },
  {
    id: "2",
    name: "Premium Grinder",
    category: "Equipment",
    price: 89.99,
    isActive: false,
    discount: 0,
    createdAt: "May 18, 2026",
  },
];

interface ProductTableProps {
  onEdit: () => void;
}

export default function ProductTable({
                                       onEdit,
                                     }: ProductTableProps) {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-card-sand border-b border-brand-brown/10">
          <tr>
            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Product
            </th>

            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Category
            </th>

            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Price
            </th>

            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Discount
            </th>

            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Status
            </th>

            <th className="text-left p-5 text-sm font-medium text-brand-muted">
              Created
            </th>

            <th className="text-right p-5 text-sm font-medium text-brand-muted">
              Actions
            </th>
          </tr>
          </thead>

          <tbody>
          {MOCK_PRODUCTS.map((product) => (
            <tr
              key={product.id}
              className="border-b border-brand-brown/5 hover:bg-brand-brown/[0.02] transition-colors"
            >
              <td className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-card-sand" />

                  <div>
                    <h4 className="font-medium text-brand-brown">
                      {product.name}
                    </h4>

                    <p className="text-sm text-brand-muted">
                      Premium catalog product
                    </p>
                  </div>
                </div>
              </td>

              <td className="p-5 text-brand-text">
                {product.category}
              </td>

              <td className="p-5 font-medium text-brand-brown">
                ${product.price}
              </td>

              <td className="p-5">
                {product.discount > 0
                  ? `${product.discount}%`
                  : "-"}
              </td>

              <td className="p-5">
                <DashboardBadge
                  variant={
                    product.isActive
                      ? "success"
                      : "inactive"
                  }
                >
                  {product.isActive
                    ? "Active"
                    : "Inactive"}
                </DashboardBadge>
              </td>

              <td className="p-5 text-brand-muted">
                {product.createdAt}
              </td>

              <td className="p-5">
                <div className="flex justify-end gap-2">
                  <DashboardButton
                    variant="ghost"
                    onClick={onEdit}
                  >
                    Edit
                  </DashboardButton>

                  <DashboardButton variant="danger">
                    Delete
                  </DashboardButton>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}