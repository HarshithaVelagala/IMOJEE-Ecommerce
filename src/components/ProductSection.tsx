import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "business-collaterals",
    title: "Business Collaterals",
    image: "/products/categories/business-collaterals.png",
    link: "/products?category=business-collaterals",
  },
  {
    id: "gifting",
    title: "Gifting",
    image: "/products/categories/gifting.png",
    link: "/products?category=gifting",
  },
  {
    id: "packaging",
    title: "Packaging",
    image: "/products/categories/packaging.png",
    link: "/products?category=packaging",
  },
  {
    id: "sweatshirts",
    title: "Sweat Shirts & Hoodies",
    image: "/products/categories/sweatshirts.png",
    link: "/products?category=sweatshirts",
  },
];

export function ProductSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Our Products
          </h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className="group block overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Purple category label section */}
              <div className="bg-purple-700 py-4 px-2 text-center transition-colors duration-300 group-hover:bg-purple-800">
                <h3 className="text-[15px] sm:text-base font-semibold text-white tracking-wide">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
