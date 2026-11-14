import type { Metadata } from "next";
import { cookies } from "next/headers";
import WoodwrightsHome from "@/components/sites/woodpattarai/woodpattarai-home";

export const metadata: Metadata = {
  title: "WOOD PATTARAI — NZ Made Quality Furniture",
  description:
    "Objects of craft, made to be lived with. New Zealand made furniture by WOOD PATTARAI.",
  icons: {
    icon: { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    apple: "/apple-touch-icon.png",
  },
};

export default async function WoodpattaraiPage() {
  const initialRoomBright = (await cookies()).get("woodpattarai-room-bright")?.value === "true";
  return <WoodwrightsHome initialRoomBright={initialRoomBright} />;
}
