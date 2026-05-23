"use client";

import { useState } from "react";

import ProductStats from "@/components/dashboard/products/ProductStats";
import ProductToolbar from "@/components/dashboard/products/ProductToolbar";
import ProductTable from "@/components/dashboard/products/ProductTable";
import ProductFormPanel from "@/components/dashboard/products/ProductFormPanel";

export default function ProductPage() {
  const [isPanelOpen, setIsPanelOpen] =
    useState(false);

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
          onCreate={() => setIsPanelOpen(true)}
        />

        <ProductTable
          onEdit={() => setIsPanelOpen(true)}
        />
      </div>

      <ProductFormPanel
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}