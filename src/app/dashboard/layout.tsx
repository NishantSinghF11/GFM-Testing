import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Command Center",
  description: "Manage your creative pipeline, analyze business intelligence, and release assets via the GFM Vault.",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
