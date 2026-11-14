import type { Metadata } from "next";
import { cookies } from "next/headers";
import WoodwrightsHome from "@/components/sites/woodpattarai/woodpattarai-home";

export const metadata: Metadata = {
  title: "WOOD PATTARAI — NZ Made Quality Furniture",
  description: "Objects of craft, made to be lived with. New Zealand made furniture by WOOD PATTARAI.",
};

export default async function Home() {
  const initialRoomBright = (await cookies()).get("woodpattarai-room-bright")?.value === "true";
  return <WoodwrightsHome initialRoomBright={initialRoomBright} />;
}
