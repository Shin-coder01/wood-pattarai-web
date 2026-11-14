import type { Metadata } from "next";
import { InteractiveLight } from "@/components/sites/light-demo/interactive-light";

export const metadata: Metadata = {
  title: "Interactive Light Study | WOOD PATTARAI",
  description:
    "Explore a physics-driven hanging spotlight with live beam, brightness, and color controls.",
};

export default function LightDemoPage() {
  return <InteractiveLight />;
}
