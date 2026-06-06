import Link from "next/link";

/** Fallback when locale segment is missing — send users to default home. */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f6f1] px-4 text-center">
      <p className="text-sm font-semibold tracking-wide text-[#c9a227] uppercase">404</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1a2744] sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        This property or page doesn&apos;t exist, or the listing may still be awaiting approval.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/en"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1a2744] px-6 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
        <Link
          href="/en/search"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1a2744]/20 bg-white px-6 text-sm font-semibold text-[#1a2744]"
        >
          Browse listings
        </Link>
      </div>
    </div>
  );
}
