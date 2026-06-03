"use client";

import { useState } from "react";
import ProductStats from "@/components/dashboard/products/ProductStats";
import ProductToolbar from "@/components/dashboard/products/ProductToolbar";
import ProductTable from "@/components/dashboard/products/ProductTable";
import ProductFormPanel from "@/components/dashboard/products/ProductFormPanel";
import {DashboardProductsType} from "@/types/products";

export type ModealModeType = 'create' | 'editing' | null

export default function ProductTab() {
  const [modalMode, setModalMode] = useState<ModealModeType>(null)

  const [editingProduct, setEditingProduct] = useState<DashboardProductsType | undefined>(undefined)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-brown mb-2">
          Products
        </h1>

        <p className="text-brand-muted max-w-2xl">
          Manage your catalog, pricing, discounts and
          product availability.
        </p>
      </div>

      <div className="space-y-6">

        <ProductStats />

        <ProductToolbar
          onCreate={() => {
            setModalMode('create')
          }}
        />

        <ProductTable
          onEdit={() => {
            setModalMode('editing')
          }}
          setEditingProductAction={setEditingProduct}
        />
      </div>

      <ProductFormPanel
        open={!!modalMode}
        modalMode={modalMode}
        editingProduct={editingProduct}
        setEditingProductAction={setEditingProduct}
        onClose={() => {
          setEditingProduct(undefined)
          setModalMode(null)
        }}
      />
    </div>
  );
}