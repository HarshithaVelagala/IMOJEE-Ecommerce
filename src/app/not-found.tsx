import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-10">
      <div className="max-w-xl text-center rounded-4xl border border-neutral-200 bg-neutral-50 p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-purple-600 font-semibold">404</p>
        <h1 className="mt-6 text-4xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-4 text-neutral-600">The product or page you are looking for does not exist. Please check the URL or return to the homepage.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
