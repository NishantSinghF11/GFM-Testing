import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Secure Checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
