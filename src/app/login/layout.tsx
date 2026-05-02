import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
