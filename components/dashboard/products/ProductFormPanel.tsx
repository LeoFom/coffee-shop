"use client";

import DashboardButton from "@/components/dashboard/ui/DashboardButton";
import DashboardInput from "@/components/dashboard/ui/DashboardInput";
import DashboardTextarea from "@/components/dashboard/ui/DashboardTextarea";
import DashboardSelect from "@/components/dashboard/ui/DashboardSelect";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {DashboardProductsType} from "@/components/dashboard/types/dashboardTypes";
import {createProduct} from "@/lib/features/api/products/createProduct";
import {updateProduct} from "@/lib/features/api/products/updateProduct";
import {handleRequestNotification} from "@/lib/handler/handleRequestNotification";
import {Dispatch, SetStateAction, useEffect} from "react";
import {ModealModeType} from "@/dashboard/products/ProductTab";
import {useRouter} from "next/navigation";
import {EMPTY_PRODUCT} from "@/dashboard/data/dashboardData";

interface ProductFormPanelProps {
  modalMode: ModealModeType;
  editingProduct?: DashboardProductsType;
  open: boolean;
  setEditingProductAction: Dispatch<SetStateAction<DashboardProductsType | undefined>>;
  onClose: () => void;
}

export default function ProductFormPanel({
  modalMode,
  editingProduct,
  open,
  onClose,
}: ProductFormPanelProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DashboardProductsType>({
    defaultValues: EMPTY_PRODUCT,
  });

  const onSubmit = async (data: DashboardProductsType) => {
    try {
      const response =
        modalMode === "create"
          ? await createProduct(data)
          : await updateProduct(data.id, data);

      const result = await response.json();

      console.log("(onSubmit) => result",result)
      if (!response.ok) {
        throw new Error(
          result?.message || response.statusText
        );
      }

      handleRequestNotification(
        response,
        result,
        {
          successMessage:
            modalMode === "create"
              ? "Product created"
              : "Product updated",
        }
      );

      router.refresh();
      reset();
      onClose();

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unexpected server error"
      );
    }
  };

  useEffect(() => {
    if (editingProduct && modalMode === 'editing') {
      reset(editingProduct);
    } else {
      reset(EMPTY_PRODUCT);
    }
  }, [editingProduct, modalMode, reset]);

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
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
                type="button"
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

              <div>
                <DashboardInput
                  placeholder="Product Name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <DashboardInput
                placeholder="slug-name"
                {...register("slug")}
              />

              <DashboardTextarea
                minLength={10}
                placeholder="Description..."
                {...register("description")}
              />
            </section>

            <section className="space-y-5">
              <h3 className="font-serif font-bold text-brand-brown text-lg">
                Pricing
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <DashboardInput
                  type="number"
                  placeholder="Price"
                  {...register("price", {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be positive",
                    },
                  })}
                />

                <DashboardInput
                  type="number"
                  placeholder="Discount %"
                  {...register("discount", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="font-serif font-bold text-brand-brown text-lg">
                Organization
              </h3>

              <DashboardSelect
                {...register("category", {
                  required: "Category is required",
                })}
              >
                <option value="">Select Category</option>
                <option value="Coffee">Coffee</option>
                <option value="Equipment">Equipment</option>
                <option value="Merchandise">Merchandise</option>
              </DashboardSelect>

              <DashboardSelect {...register("roast")}>
                <option value="">Select Roast</option>
                <option value="Light">Light</option>
                <option value="Medium">Medium</option>
                <option value="Dark">Dark</option>
              </DashboardSelect>
            </section>

            <section className="space-y-5">
              <h3 className="font-serif font-bold text-brand-brown text-lg">
                Media
              </h3>

              <DashboardInput
                placeholder="Image URL"
                {...register("imageUrl")}
              />
            </section>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-brand-brown/10 p-6">
            <div className="flex items-center justify-end gap-3">
              <DashboardButton
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </DashboardButton>

              <DashboardButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Product"}
              </DashboardButton>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}