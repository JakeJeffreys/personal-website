import type { Metadata } from "next";
import ReturnToSender from "@/components/ReturnToSender";

export const metadata: Metadata = {
  title: "Address unknown — Jake Jeffreys",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <ReturnToSender />
    </main>
  );
}
