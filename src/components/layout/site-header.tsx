import Link from "next/link";
import { LayoutDashboard, Plus, Search, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { RwandaColorBar } from "@/components/layout/rwanda-color-bar";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const navLinks = [
  { label: "Rent", href: "/search?type=rent" },
  { label: "Buy", href: "/search?type=sale" },
  { label: "Short stay", href: "/search?type=short_stay" },
  { label: "Find agent", href: "/agents" },
  { label: "Safety", href: "/safety" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <RwandaColorBar />
      <div className="border-b border-border/70 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-rw-blue font-heading text-sm font-bold text-white">
              RH
            </span>
            <div className="hidden flex-col leading-none sm:flex">
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="bg-gradient-to-r from-rw-blue via-rw-yellow to-rw-green bg-clip-text text-[11px] font-semibold text-transparent">
                Find. Contact. Move in.
              </span>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-rw-blue/5 hover:text-rw-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search listings"
              className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "lg:hidden")}
            >
              <Search className="size-4" />
            </Link>
            <Link
              href="/portal"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden border-rw-green/30 text-rw-green hover:bg-rw-green/5 sm:inline-flex",
              )}
            >
              <LayoutDashboard className="size-4" />
              My portal
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden md:inline-flex",
              )}
            >
              <User className="size-4" />
              Log in
            </Link>
            <Link
              href="/listings/new"
              className={cn(buttonVariants({ size: "sm" }), "bg-rw-blue font-semibold hover:bg-rw-blue/90")}
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Post property</span>
              <span className="sm:hidden">Post</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
