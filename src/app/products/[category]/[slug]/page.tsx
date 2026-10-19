import ProductDetails from "@/components/ProductDetails";
import { getProductByCategoryAndSlug } from "@/data/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProductByCategoryAndSlug(category, slug);

  if (!product) {
    return {
      title: "Product Not Found | Imojee",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Imojee`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  console.log("Category:", category);
  console.log("Slug:", slug);

  const product = getProductByCategoryAndSlug(category, slug);
  console.log("Matched product:", product?.id ?? "none");

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
