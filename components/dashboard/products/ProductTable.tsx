"use client";

import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import DashboardBadge from "@/components/dashboard/ui/DashboardBadge";
import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import {DashboardProductsType} from "@/types/products";
import {selectProducts} from "@/store/products/productSelectors";
import {useSelector} from "react-redux";
import {Dispatch, SetStateAction} from "react";
import {Skeleton} from "@/ui/skeleton";
import Image from "next/image";

interface ProductTableProps {
  onEdit: () => void;
  setEditingProductAction: Dispatch<SetStateAction<DashboardProductsType | undefined>>;
}

function ProductTable({
  onEdit,
  setEditingProductAction,
}: ProductTableProps) {
  const products: DashboardProductsType[] = useSelector(selectProducts)
  const isLoading = !products

  const skeletonRows = Array.from({ length: 5 });

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
          {isLoading ? (
            // --- ЭКРАН ЗАГРУЗКИ (SKELETON) ---
            skeletonRows.map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-b border-brand-brown/5">
                {/* Product (Изображение + 2 строки текста) */}
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-xl bg-brand-brown/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px] bg-brand-brown/10" />
                      <Skeleton className="h-3 w-[150px] bg-brand-brown/10" />
                    </div>
                  </div>
                </td>
                {/* Category */}
                <td className="p-5">
                  <Skeleton className="h-4 w-[80px] bg-brand-brown/10" />
                </td>
                {/* Price */}
                <td className="p-5">
                  <Skeleton className="h-4 w-[50px] bg-brand-brown/10" />
                </td>
                {/* Discount */}
                <td className="p-5">
                  <Skeleton className="h-4 w-[40px] bg-brand-brown/10" />
                </td>
                {/* Status */}
                <td className="p-5">
                  <Skeleton className="h-6 w-[70px] rounded-full bg-brand-brown/10" />
                </td>
                {/* Created */}
                <td className="p-5">
                  <Skeleton className="h-4 w-[90px] bg-brand-brown/10" />
                </td>
                {/* Actions */}
                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-9 w-[60px] rounded-md bg-brand-brown/10" />
                    <Skeleton className="h-9 w-[70px] rounded-md bg-brand-brown/10" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // --- РЕАЛЬНЫЕ ДАННЫЕ ---
            products?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-brand-brown/5 hover:bg-brand-brown/[0.02] transition-colors"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl bg-card-sand">
                      <Image
                        src={product.imageUrl ?? ''}
                        alt={product.name ?? `Product ${product.id}`}
                        fill
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-brown">{product.name}</h4>
                      <p className="text-sm text-brand-muted">Premium catalog product</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-brand-text">{product.category}</td>
                <td className="p-5 font-medium text-brand-brown">${product.price}</td>
                <td className="p-5">{'0%'}</td>
                <td className="p-5">
                  <DashboardBadge variant={product.isActive ? "success" : "inactive"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </DashboardBadge>
                </td>
                <td className="p-5 text-brand-muted">{product.createdAt}</td>
                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    <DashboardButton
                      variant="ghost"
                      onClick={() => {
                        setEditingProductAction(product);
                        onEdit();
                      }}
                    >
                      Edit
                    </DashboardButton>
                    <DashboardButton variant="danger">Delete</DashboardButton>
                  </div>
                </td>
              </tr>
            ))
          )}

          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export default ProductTable