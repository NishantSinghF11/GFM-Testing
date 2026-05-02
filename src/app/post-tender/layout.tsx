import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch a Tender",
  description: "Create high-fidelity project briefs with AI assistance and attract elite creative talent.",
};

export default function PostTenderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
