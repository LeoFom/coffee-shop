"use client";

import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import DashboardInput from "@/components/dashboard/ui/DashboardInput";
import DashboardTextarea from "@/components/dashboard/ui/DashboardTextarea";
import DashboardSelect from "@/components/dashboard/ui/DashboardSelect";

interface ProductFormPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ProductFormPanel({
 open,
 onClose,
}: ProductFormPanelProps) {
  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/30 z-40 transition-opacity
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-[620px]
          bg-brand-bg z-50 shadow-2xl
          transition-transform duration-300
          flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="px-8 py-6 border-b border-brand-brown/10 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-brown">
                Create Product
              </h2>

              <p className="text-brand-muted mt-1">
                Add a new product to your catalog.
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-2xl text-brand-muted hover:text-brand-brown"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">

          <section className="space-y-5">
            <div>
              <h3 className="font-serif font-bold text-brand-brown text-lg">
                General
              </h3>
            </div>

            <DashboardInput placeholder="Product Name" />

            <DashboardInput placeholder="slug-name" />

            <DashboardTextarea placeholder="Description..." />
          </section>

          <section className="space-y-5">
            <h3 className="font-serif font-bold text-brand-brown text-lg">
              Pricing
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <DashboardInput
                type="number"
                placeholder="Price"
              />

              <DashboardInput
                type="number"
                placeholder="Discount %"
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="font-serif font-bold text-brand-brown text-lg">
              Organization
            </h3>

            <DashboardSelect>
              <option>Select Category</option>
              <option>Coffee</option>
              <option>Equipment</option>
              <option>Merchandise</option>
            </DashboardSelect>

            <DashboardSelect>
              <option>Select Roast</option>
              <option>Light</option>
              <option>Medium</option>
              <option>Dark</option>
            </DashboardSelect>
          </section>

          <section className="space-y-5">
            <h3 className="font-serif font-bold text-brand-brown text-lg">
              Media
            </h3>

            <DashboardInput placeholder="Image URL" />
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-brand-brown/10 p-6">
          <div className="flex items-center justify-end gap-3">
            <DashboardButton
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </DashboardButton>

            <DashboardButton>
              Save Product
            </DashboardButton>
          </div>
        </div>
      </div>
    </>
  );
}