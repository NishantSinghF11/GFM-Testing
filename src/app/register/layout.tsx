import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Register",
  noIndex: true,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
