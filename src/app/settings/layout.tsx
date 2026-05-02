import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Account Settings",
  noIndex: true,
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
