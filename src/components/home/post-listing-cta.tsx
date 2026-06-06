import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PostListingCta() {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-rw-green to-rw-green/85 text-white shadow-lg">
      <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Home className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Have a property to list?
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-base">
              Post for free and reach thousands of seekers across Rwanda. No
              listing fees, no hidden charges — contact details always visible.
            </p>
          </div>
        </div>
        <Link
          href="/listings/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "shrink-0 bg-rw-yellow text-foreground hover:bg-rw-yellow/90",
          )}
        >
          List your property
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
