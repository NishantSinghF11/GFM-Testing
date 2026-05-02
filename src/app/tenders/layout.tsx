import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities Hub",
  description: "Browse high-stakes project tenders, track market heat, and win premium work with AI-powered matching.",
};

export default function TendersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
