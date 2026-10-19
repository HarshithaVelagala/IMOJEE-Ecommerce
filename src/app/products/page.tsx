import { getProductByCategory, products as allProducts } from "@/data/products";
import { ProductList } from "@/components/ProductList";
import Link from "next/link";

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const categoryParam = searchParams?.category;
  const category = typeof categoryParam === 'string' ? categoryParam : undefined;

  let displayProducts = allProducts;
  let pageTitle = "All Products";

  if (category) {
    displayProducts = getProductByCategory(category);
    if (displayProducts.length > 0) {
      pageTitle = displayProducts[0].categoryTitle || displayProducts[0].category;
    } else {
      pageTitle = "Category not found";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
          {pageTitle}
        </h1>
        <div className="w-16 h-1 bg-purple-600 rounded-full mb-6"></div>
        {category && (
          <Link href="/products" className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
            &larr; View all products
          </Link>
        )}
      </div>

      {displayProducts.length > 0 ? (
        <ProductList products={displayProducts} />
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">No products found</h2>
          <p className="text-neutral-500 mb-8">We couldn't find any products in this category.</p>
          <Link href="/products" className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
