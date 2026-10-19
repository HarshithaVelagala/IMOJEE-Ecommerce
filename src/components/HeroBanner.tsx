import Image from "next/image";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-neutral-100 overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
          alt="Hero Banner Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl drop-shadow-md">
          Premium Gifts for Every Occasion
        </h1>
        <p className="text-lg md:text-xl text-neutral-100 max-w-2xl drop-shadow">
          Discover our curated collection of festive gifts, exclusive products, and corporate gifting solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link
            href="/products"
            className="px-8 py-3 bg-white text-neutral-900 font-medium rounded-md hover:bg-neutral-100 transition-colors shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
