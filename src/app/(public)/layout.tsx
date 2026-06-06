import { AmniiFooter } from "@/components/amnii/footer";
import { AmniiHeader } from "@/components/amnii/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AmniiHeader />
      <main className="flex-1">{children}</main>
      <AmniiFooter />
    </>
  );
}
