import { UtmCapture } from "@/components/analytics/utm-capture";
import { AmniiFooter } from "@/components/amnii/footer";
import { AmniiHeader } from "@/components/amnii/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UtmCapture />
      <AmniiHeader />
      <main className="flex-1">{children}</main>
      <AmniiFooter />
    </>
  );
}
