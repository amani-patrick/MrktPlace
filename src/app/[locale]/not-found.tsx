import { Home, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AmniiFooter } from "@/components/amnii/footer";
import { AmniiHeader } from "@/components/amnii/header";
import { AmniiLogo } from "@/components/amnii/logo";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <>
      <AmniiHeader />
      <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center bg-amnii-cream px-4 py-16 text-center">
      <AmniiLogo className="mb-8" />
      <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
        {t("code")}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-amnii-navy sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("description")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "gap-2 bg-amnii-navy text-white hover:bg-amnii-navy/90",
          )}
        >
          <Home className="size-4" aria-hidden="true" />
          {t("home")}
        </Link>
        <Link
          href="/search"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
        >
          <Search className="size-4" aria-hidden="true" />
          {t("search")}
        </Link>
      </div>
      </div>
      <AmniiFooter />
    </>
  );
}
