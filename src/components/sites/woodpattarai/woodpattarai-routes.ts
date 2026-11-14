import { woodwrightsProducts } from "./woodwrights-products";

export type WoodpattaraiRouteKind =
  | "product"
  | "collection"
  | "search"
  | "cart"
  | "materials"
  | "about"
  | "resources"
  | "showroom"
  | "contact"
  | "information"
  | "policy"
  | "account";

export type WoodpattaraiRoute = {
  path: string;
  title: string;
  kind: WoodpattaraiRouteKind;
  description?: string;
};

const collectionDescriptions: Record<string, string> = {
  all: "Browse New Zealand designed and crafted furniture, made locally in a wide range of solid timbers, upholstery options and finishes. Each piece is tailored in our factory to reflect your lifestyle and space.",
  seating: "Choose from New Zealand designed and made chairs, sofas, stools and other seating, personalised with your choice of upholstery, timber and finishes.",
  "all-seating": "Finding the right seating for your space and lifestyle is a personal journey. Explore New Zealand designed and made chairs, sofas and stools, personalised in your chosen upholstery, timber and finishes.",
  "all-tables": "Tables are foundational pieces in a home and places to gather. Explore New Zealand designed and made coffee, dining and side tables, personalised in your chosen timber and finishes.",
  "all-beds": "From solid timber beds to upholstered headboards, find made-to-order pieces in the size, upholstery, timber and finish suited to your space.",
  "headboard": "Add a considered finishing touch to your bedroom with made-to-order headboards in your chosen size, upholstery, timber and finish.",
  "bedside-table": "Explore New Zealand designed and crafted bedsides, from compact options to pieces with generous storage.",
  "all-storage": "Made-to-order storage pieces combine practical use with considered design, in a range of sizes, timbers and finishes.",
  mirrors: "Quality mirrors with timber surrounds, crafted to order in New Zealand in a range of timbers, finishes and sizes.",
  outdoor: "Outdoor pieces are crafted for long-term performance with Iroko timber, marine-grade framing, outdoor foams and exterior fabrics.",
  living: "Find considered furniture for connecting and relaxing, from sofas and occasional chairs to coffee tables and storage, designed and crafted in New Zealand.",
  dining: "Explore dining tables, chairs and storage made in New Zealand to suit the way you gather. Choose from a range of timber finishes and sizes.",
  bedroom: "Create a personalised bedroom with made-to-order New Zealand furniture, from beds and headboards to bedsides and dressers.",
  sofas: "Sofas and modular sofas are personal pieces that need to suit your space and lifestyle. Choose from our range of New Zealand designed and made sofas, each with a unique comfort system. Personalise your sofa in your chosen size, upholstery and timber.",
  "new-arrivals": "Discover recently added New Zealand designed and crafted furniture in solid timber, upholstery and considered finishes.",
  "kindred-chapter-01": "The first chapter of Kindred brings together pieces shaped by the warmth and texture of local coastlines, from modular lounging to sculptural timber forms.",
  exdisplay: "Pieces previously displayed in our showrooms may show insignificant wear. Each is in saleable working order and offered at a reduced price.",
  "on-display-in-auckland": "Discover furniture currently on display in our Auckland showroom at 1/299 Great North Road, Grey Lynn.",
};

const collectionRoutes: WoodpattaraiRoute[] = [
  ["all", "Shop all"],
  ["seating", "Seating"],
  ["all-seating", "All Seating"],
  ["all-tables", "All Tables"],
  ["bar-stools", "Bar Stools"],
  ["barstool-1", "Bar Stools"],
  ["dining-chairs", "Dining Chairs"],
  ["dining-chair", "Dining Chairs"],
  ["lounge-chairs", "Lounge Chairs"],
  ["sofas", "Sofas"],
  ["coffee-table", "Coffee Tables"],
  ["console-table", "Console Tables"],
  ["dining-table", "Dining Tables"],
  ["side-table", "Side Tables"],
  ["desks", "Desks"],
  ["desk", "Desks"],
  ["all-beds", "Beds"],
  ["beds", "Beds"],
  ["headboards", "Headboards"],
  ["headboard", "Headboards"],
  ["bedside-table", "Bedsides"],
  ["bookcases", "Bookcases"],
  ["bookcase", "Bookcases"],
  ["dressers", "Dressers"],
  ["dresser", "Dressers"],
  ["sideboards", "Sideboards"],
  ["sideboard-1", "Sideboards"],
  ["tallboys", "Tallboys"],
  ["all-storage", "All Storage"],
  ["mirrors", "Mirrors"],
  ["living", "Living Room"],
  ["dining", "Dining Room"],
  ["bedroom", "Bedroom"],
  ["new-arrivals", "New Arrivals"],
  ["kindred-chapter-01", "Kindred Chapter 01"],
  ["bouba-kiki", "Bouba–Kiki"],
  ["outdoor", "Outdoor"],
  ["exdisplay", "Ex Display"],
  ["on-display-in-auckland", "On Display in Auckland"],
].map(([slug, title]) => ({
  path: `collections/${slug}`,
  title,
  kind: "collection",
  description: collectionDescriptions[slug] ?? `Explore ${title.toLowerCase()} designed and made in New Zealand, with considered materials and finishes.`,
}));

const productRoutes: WoodpattaraiRoute[] = woodwrightsProducts.map((product) => ({
  path: `products/${product.handle}`,
  title: product.name,
  kind: "product",
  description: `${product.name}, designed and made in New Zealand. ${product.price}.`,
}));

const informationRoutes: WoodpattaraiRoute[] = [
  ["ex-display", "Ex Display"],
  ["lead-times", "Lead Times"],
  ["delivery", "Delivery"],
  ["warranty", "Warranty"],
  ["care-and-maintenance", "Care & Maintenance"],
  ["care-maintenance", "Care & Maintenance"],
  ["trade", "Trade Accounts"],
  ["trade-signup", "Trade Account Application"],
  ["faqs", "FAQs"],
  ["terms-of-trade", "Terms of Trade"],
].map(([slug, title]) => ({
  path: `pages/${slug}`,
  title,
  kind: "information",
}));

const policyRoutes: WoodpattaraiRoute[] = [
  ["privacy-policy", "Privacy Policy"],
  ["terms-of-service", "Terms & Conditions"],
].map(([slug, title]) => ({
  path: `policies/${slug}`,
  title,
  kind: "policy",
}));

export const woodpattaraiRoutes: WoodpattaraiRoute[] = [
  ...collectionRoutes,
  ...productRoutes,
  { path: "search", title: "Search", kind: "search" },
  { path: "cart", title: "Your Cart", kind: "cart" },
  {
    path: "pages/materials",
    title: "Materials",
    kind: "materials",
    description:
      "Explore upholstery, timber, stone, metal and considered finishes. Request complimentary samples to find the right combination for your space.",
  },
  {
    path: "pages/about",
    title: "About",
    kind: "about",
    description:
      "What sets us apart is our intentional approach to design, materiality, experience and delivery. Each stage is considered, offering our clients a personalised and tailored journey.",
  },
  {
    path: "pages/resources",
    title: "Design Resources",
    kind: "resources",
    description:
      "Find product specifications and design resources to support your next project.",
  },
  {
    path: "pages/showroom",
    title: "Visit our showroom",
    kind: "showroom",
    description:
      "Experience our furniture, materials and finishes in person at our Auckland showroom.",
  },
  {
    path: "pages/contact",
    title: "Contact",
    kind: "contact",
    description: "Our team is here to help with product advice, orders and showroom visits.",
  },
  {
    path: "pages/shipping",
    title: "Shipping & Delivery",
    kind: "information",
  },
  ...informationRoutes,
  ...policyRoutes,
  { path: "account/login", title: "My Account", kind: "account" },
];

export function getWoodpattaraiRoute(path: string) {
  return woodpattaraiRoutes.find((route) => route.path === path);
}

export function getWoodpattaraiRouteTitle(path: string) {
  return getWoodpattaraiRoute(path)?.title;
}
