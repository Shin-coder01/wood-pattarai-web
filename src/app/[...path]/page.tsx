import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WoodpattaraiDestination } from "@/components/sites/woodpattarai/woodpattarai-destination";
import {
  getWoodpattaraiRoute,
  woodpattaraiRoutes,
} from "@/components/sites/woodpattarai/woodpattarai-routes";

type RouteProps = {
  params: Promise<{ path: string[] }>;
};

export function generateStaticParams() {
  return woodpattaraiRoutes.map(({ path }) => ({ path: path.split("/") }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { path } = await params;
  const route = getWoodpattaraiRoute(path.join("/"));

  if (!route) return { title: "Page not found" };

  return {
    title: `${route.title} | WOOD PATTARAI`,
    description: route.description ?? `Explore ${route.title.toLowerCase()} by WOOD PATTARAI.`,
  };
}

export default async function DestinationPage({ params }: RouteProps) {
  const { path } = await params;
  const route = getWoodpattaraiRoute(path.join("/"));

  if (!route) notFound();

  return <WoodpattaraiDestination route={route} />;
}
