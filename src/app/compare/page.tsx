"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/hooks/useCompare";
import { useToast } from "@/components/ToastProvider";
import { getProductsByIds } from "@/data/products";

export default function ComparePage() {
  const { items, remove } = useCompare();
  const { showToast } = useToast();
  const products = getProductsByIds(items);

  const handleRemove = (id: string) => {
    remove(id);
    showToast("Removed from compare");
  };

  return (
    <div className="container mx-auto px-4 py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-semibold">Compare</p>
        <h1 className="mt-4 text-4xl font-bold text-neutral-900">Product Comparison</h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-purple-50 p-16 text-center">
          <p className="text-lg font-semibold text-neutral-900">No products selected for comparison</p>
          <Link href="/products" className="inline-flex mt-8 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700">
            Choose products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50 text-left text-sm uppercase tracking-[0.2em] text-neutral-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white text-sm text-neutral-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-5 align-top">
                    <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-neutral-100">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-semibold text-neutral-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-5 align-top font-semibold text-purple-600">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-5 align-top max-w-[320px] text-neutral-600">{product.description}</td>
                  <td className="px-6 py-5 align-top text-neutral-700">{product.categoryTitle}</td>
                  <td className="px-6 py-5 align-top">
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
