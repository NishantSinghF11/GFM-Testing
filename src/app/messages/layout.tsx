import { constructMetadata } from "@/lib/seo/meta";

export const metadata = constructMetadata({
  title: "Secure Messaging",
  noIndex: true,
});

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
