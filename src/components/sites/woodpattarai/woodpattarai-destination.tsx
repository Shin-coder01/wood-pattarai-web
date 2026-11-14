import Image from "next/image";
import {
  getWoodpattaraiRouteTitle,
  type WoodpattaraiRoute,
} from "./woodpattarai-routes";
import { shopGroups } from "./woodpattarai-navigation";
import styles from "./woodpattarai-destination.module.css";
import {
  getWoodwrightsProduct,
  getWoodwrightsProductsForCollection,
} from "./woodwrights-products";
import { WoodwrightsNewsletter } from "./woodwrights-newsletter";
import { WoodwrightsContactForm } from "./woodwrights-contact-form";
import { WoodwrightsMaterialLibrary } from "./woodwrights-material-library";
import { WoodwrightsResourceCatalog } from "./woodwrights-resource-catalog";
import { WoodwrightsAnnouncement } from "./woodwrights-announcement";
import { WoodwrightsCollectionProducts } from "./woodwrights-collection-products";
import {
  WoodwrightsCart,
  WoodwrightsCartLink,
  WoodwrightsProductActions,
  WoodwrightsSearch,
} from "./woodwrights-commerce";
import { WoodwrightsAssistant } from "./woodwrights-assistant";

const materials = ["Upholstery", "Timber", "Stone", "Powdercoat", "Metal", "Handles", "Piping"] as const;

const aboutJournalEntries = [
  {
    date: "March 2026",
    title: "Launching soon, Kindred Chapter 01",
    text: "Soft ochre sands, sunlit tones at dawn and the gentle ebb of the tide inform the first chapter of Kindred.",
    image: "https://woodwrights.co.nz/cdn/shop/articles/WW_KindredCol_LaunchingSoon_009_b9ee1180-74b6-47a5-895b-0f4fb3f8499b.png?v=1774489165&width=1200",
  },
  {
    date: "December 2025",
    title: "A celebration of Bouba-Kiki",
    text: "A gathering at the Auckland showroom to celebrate the limited-edition side table collaboration with Buster Caldwell and Luke Jacomb.",
    image: "https://woodwrights.co.nz/cdn/shop/articles/BoubaKikiEvent_001.png?v=1764719138&width=1200",
  },
] as const;

function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/" aria-label="WOOD PATTARAI home">WOOD PATTARAI</a>
      <nav aria-label="Main navigation">
        <details className={styles.shopNavigation}>
          <summary>Shop</summary>
          <div className={styles.shopMegaMenu}>
            <a className={styles.shopAllLink} href="/collections/all">Shop all furniture <span aria-hidden="true">↗</span></a>
            {shopGroups.map((group) => (
              <div className={styles.shopMenuGroup} key={group.title}>
                <h2>{group.title}</h2>
                {group.items.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
              </div>
            ))}
          </div>
        </details>
        <a href="/pages/materials">Materials</a>
        <a href="/pages/about">About</a>
        <a href="/pages/resources">Resources</a>
        <a href="/pages/showroom">Showroom</a>
        <a href="/pages/contact">Contact</a>
        <a className={styles.headerUtility} href="/search">Search</a>
        <a className={styles.headerUtility} href="/account/login">Account</a>
        <WoodwrightsCartLink />
      </nav>
    </header>
  );
}

function ProductGrid({ collection }: { collection: string }) {
  const visibleProducts = getWoodwrightsProductsForCollection(collection);

  if (visibleProducts.length === 0) {
    return <p className={styles.emptyCollection}>This collection is being refreshed. Please contact our team for current availability.</p>;
  }

  return <WoodwrightsCollectionProducts products={visibleProducts} />;
}

function CollectionService() {
  return (
    <section className={styles.collectionService} aria-label="Our made-to-order process">
      <ol>
        <li><span>01</span> Work with our team</li>
        <li><span>02</span> Sampling</li>
        <li><span>03</span> Crafted to order</li>
        <li><span>04</span> Delivered by us</li>
      </ol>
      <p>Every piece is made to order in our Tasman workshops. Our team can guide you through sizes, materials and finishes, then keep you updated from sampling through to delivery.</p>
      <a className={styles.textLink} href="/pages/contact">Talk with our team <span aria-hidden="true">↗</span></a>
    </section>
  );
}

function ProductPage({ productHandle }: { productHandle: string }) {
  const product = getWoodwrightsProduct(productHandle);
  if (!product) return null;
  const isEbbStool = product.handle.startsWith("ebb-bar-stool-");
  const isBackless = product.handle.includes("backless");
  const seatHeight = product.handle.includes("750sh") ? "750SH" : "650SH";
  const stoolDescription = "Ebb is a sculptural bar stool defined by its solid timber rear leg, which traces a single, uninterrupted line. An upholstered seat brings warmth and comfort, while a brushed stainless steel footrest adds a refined detail. Available with or without a backrest, and in two heights, to suit a range of spaces.";

  return (
    <section className={styles.productDetail}>
      <div className={styles.productDetailImage}>
        <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 760px) 100vw, 58vw" priority />
      </div>
      <div className={styles.productDetailCopy}>
        <p className={styles.eyebrow}>New Zealand made / made to order</p>
        <h1>{product.name}</h1>
        <p className={styles.productDetailPrice}>{product.price}</p>
        {isEbbStool ? (
          <div className={styles.ebbVariantOptions}>
            <p>Seat height <span>{seatHeight}</span></p>
            <div>
              {["650SH", "750SH"].map((height) => {
                const handle = `ebb-bar-stool-${isBackless ? "backless" : "timber-back"}-${height.toLowerCase()}`;
                return <a aria-current={height === seatHeight ? "page" : undefined} href={`/products/${handle}`} key={height}>{height}</a>;
              })}
            </div>
            <p>Backrest <span>{isBackless ? "Backless" : "Timber back"}</span></p>
            <div>
              {[{ label: "Timber back", type: "timber-back" }, { label: "Backless", type: "backless" }].map((option) => {
                const handle = `ebb-bar-stool-${option.type}-${seatHeight.toLowerCase()}`;
                return <a aria-current={option.type === (isBackless ? "backless" : "timber-back") ? "page" : undefined} href={`/products/${handle}`} key={option.type}>{option.label}</a>;
              })}
            </div>
          </div>
        ) : null}
        <WoodwrightsProductActions product={product} />
        <p>{isEbbStool ? stoolDescription : "Designed and made in New Zealand. Personalise this piece with considered materials and finishes selected for your home."}</p>
        {isEbbStool ? <p className={styles.productDetailNote}>Made to order · 8–10 weeks · On display in Auckland</p> : null}
        <a className={styles.primaryLink} href={`/pages/contact?product=${encodeURIComponent(product.name)}`}>Make an enquiry <span aria-hidden="true">↗</span></a>
        <a className={styles.textLink} href="/pages/materials">Explore material library <span aria-hidden="true">↗</span></a>
        <details className={styles.productDetailsAccordion}>
          <summary>Dimensions</summary>
          <p>{isEbbStool ? `Seat height ${seatHeight === "650SH" ? "650 mm" : "750 mm"}. Contact our team for the full product dimensions.` : "Contact our team for the full product dimensions."}</p>
        </details>
        <details className={styles.productDetailsAccordion}>
          <summary>Specifications</summary>
          <p>{isEbbStool ? "Shown with Organic Oak timber, Nuance Camel upholstery and a brushed stainless steel footrest. The selected configuration has a 650 mm or 750 mm seat height." : "Each piece is made to order. Contact our team for dimensions and product-specific specifications."}</p>
        </details>
        <details className={styles.productDetailsAccordion}>
          <summary>Downloads</summary>
          <p>Product specifications and 3D model resources are available from our <a href="/pages/resources">design resources library</a>.</p>
        </details>
        <details className={styles.productDetailsAccordion}>
          <summary>Care</summary>
          <p>View our <a href="/pages/care-and-maintenance">care and maintenance guidance</a> for timber, metal and upholstery.</p>
        </details>
        <details className={styles.productDetailsAccordion}>
          <summary>Delivery</summary>
          <p>Made-to-order furniture is delivered by our team across New Zealand. See <a href="/pages/delivery">delivery information</a> for details.</p>
        </details>
      </div>
    </section>
  );
}

function CollectionPage({ route }: { route: WoodpattaraiRoute }) {
  return (
    <>
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Shop / Collection</p>
        <h1>{route.title}</h1>
        <p>{route.description}</p>
      </section>
      <nav className={styles.categoryLinks} aria-label="Furniture collections">
        <a href="/collections/living">Living room</a>
        <a href="/collections/dining">Dining room</a>
        <a href="/collections/bedroom">Bedroom</a>
        <a href="/collections/sofas">Sofas</a>
        <a href="/collections/barstool-1">Bar stools</a>
      </nav>
      <ProductGrid collection={route.path.split("/").at(-1) ?? "all"} />
      <CollectionService />
    </>
  );
}

function EditorialPage({ route }: { route: WoodpattaraiRoute }) {
  const stories = [
    {
      title: "History & place",
      text: "A second generation family business founded in 1997, we have a rich history in furniture design and manufacturing. Our work is shaped by generational knowledge, craft and skill, and the expertise of artisans whose understanding of materials has been refined over time. Each Wood Pattarai piece is crafted in our own full-scale timber and upholstery factories in New Zealand. Our home and the surrounding landscape continue to inform our creativity, materiality, form and design direction.",
      image: "https://woodwrights.co.nz/cdn/shop/files/WW_Team.png?v=1734653907&width=1920",
      alt: "The Tasman coastline near Wood Pattarai’s New Zealand workshops",
    },
    {
      title: "Curated materials",
      text: "Each material in our library is chosen for its quality, longevity and alignment with our design ethos. We curate recommended options to guide your decision making, based on the unique design details and manufacturing methods of each piece. You can also specify and supply your own fabric.",
      image: "https://woodwrights.co.nz/cdn/shop/files/WW_About_001.png?v=1764813848&width=1920",
      alt: "Soft upholstery and natural timber selected for furniture",
      href: "/pages/materials",
      link: "Explore our material library",
    },
    {
      title: "Collaboration",
      text: "Working with like-minded creatives deepens design expression, builds meaningful connections and expands perspective. Previous product collaborations include the Kingsview Sofa with at.space, the SBR collection with Seear-Budd Ross, and Bouba–Kiki with Buster Caldwell and Luke Jacomb. We work with architects and designers through a holistic process, creating aligned visions and tailored outcomes for each project.",
      image: "https://woodwrights.co.nz/cdn/shop/files/WW_About_002.png?v=1764813862&width=1920",
      alt: "A considered furniture piece from a Wood Pattarai collaboration",
      href: "/pages/contact",
      link: "Make an enquiry",
    },
    {
      title: "Delivered by us",
      text: "Our own delivery service, trucks and drivers cover as much of New Zealand as we can reach. Fabian, Wise, Ben, Misi and Anton make up our freight team. They are specialists in handling furniture with care and making delivery smooth and reliable.",
      image: "https://woodwrights.co.nz/cdn/shop/files/WW_About005.png?v=1764815017&width=1920",
      alt: "Furniture being carefully prepared for delivery",
      href: "/pages/delivery",
      link: "Learn about delivery",
    },
    {
      title: "Social responsibility & sustainability",
      text: "Our team brings care and dedication to everything we do. With more than twenty-five years of manufacturing experience, we understand the methods and craftsmanship needed to make pieces that endure daily use. We source materials with sustainability and longevity in mind, from FSC-certified solid timber to leather that wears in over time, and recycle 85% of our raw materials.",
      image: "https://woodwrights.co.nz/cdn/shop/files/WW_About005.png?v=1764815017&width=1920",
      alt: "Furniture crafted from enduring natural materials",
    },
  ] as const;

  return (
    <>
      <section className={styles.aboutHero}>
        <h1>Guided by a deep respect for land and people, our furniture is a celebration of place.</h1>
        <p>{route.description}</p>
      </section>
      <section className={styles.aboutStories} aria-label="Our story and approach">
        {stories.map((story, index) => (
          <article className={styles.aboutStory} data-reverse={index % 2 === 1} key={story.title}>
            <div className={styles.aboutStoryImage}>
              <Image src={story.image} alt={story.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 54vw" />
            </div>
            <div className={styles.aboutStoryCopy}>
              <p className={styles.eyebrow}>0{index + 1} / Our approach</p>
              <h2>{story.title}</h2>
              <p>{story.text}</p>
              {"href" in story ? <a className={styles.textLink} href={story.href}>{story.link}<span aria-hidden="true"> â†—</span></a> : null}
            </div>
          </article>
        ))}
      </section>
      <section className={styles.aboutJournal} aria-labelledby="about-journal-heading">
        <div className={styles.aboutJournalHeading}>
          <p className={styles.eyebrow}>Stories from Wood Pattarai</p>
          <h2 id="about-journal-heading">Recent journal entries</h2>
        </div>
        <div className={styles.aboutJournalCards}>
          {aboutJournalEntries.map((entry) => (
            <article className={styles.journalCard} key={entry.title}>
              <div className={styles.journalImage}>
                <Image src={entry.image} alt="" fill unoptimized sizes="(max-width: 760px) 90vw, 32vw" />
              </div>
              <p className={styles.eyebrow}>{entry.date}</p>
              <h2>{entry.title}</h2>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

const informationSections: Record<string, readonly [string, string][]> = {
  "pages/lead-times": [
    ["Standard lead times", "Timber pieces generally take 6–8 weeks. Pieces using metal and upholstery generally take 8–10 weeks. Every piece is made to order in Tasman; times are indicative and may shift if unexpected disruptions occur."],
    ["Pre-Christmas orders", "To receive delivery before Christmas, place your order by 23 October. Custom work and deliveries outside Auckland, Christchurch and Wellington are assessed case by case."],
  ],
  "pages/delivery": [
    ["Wood Pattarai delivery", "Our in-house team and fleet deliver furniture nationwide within New Zealand. For some remote locations, a specialist furniture carrier may complete the final stage. Freight is calculated at checkout from the delivery location and item size; rural or difficult access can incur additional charges."],
    ["White-glove service", "Delivery includes bringing pieces into place and removing packaging. We assemble eligible beds and tables; headboard mounting and installation are excluded."],
    ["Delivery timing", "Delivery is typically 1–2 weeks after dispatch, depending on your location. Our customer service team will share dispatch estimates and coordinate delivery details with you."],
    ["Transport insurance", "Furniture is insured while in transit and while complete and awaiting delivery. Wood Pattarai takes responsibility for each piece until it has been received."],
  ],
  "pages/shipping": [
    ["Wood Pattarai delivery", "Our in-house team and fleet deliver furniture nationwide within New Zealand. For some remote locations, a specialist furniture carrier may complete the final stage. Freight is calculated at checkout from the delivery location and item size; rural or difficult access can incur additional charges."],
    ["White-glove service", "Delivery includes bringing pieces into place and removing packaging. We assemble eligible beds and tables; headboard mounting and installation are excluded."],
    ["Delivery timing", "Delivery is typically 1–2 weeks after dispatch, depending on your location. Our customer service team will share dispatch estimates and coordinate delivery details with you."],
    ["Transport insurance", "Furniture is insured while in transit and while complete and awaiting delivery. Wood Pattarai takes responsibility for each piece until it has been received."],
  ],
  "pages/warranty": [
    ["Residential warranty", "Indoor furniture is covered for 10 years, except indoor dining chairs, which are covered for 5 years. Foam is covered for 10 years. Outdoor furniture has separate care and warranty requirements."],
    ["Commercial warranty", "Indoor furniture used commercially is covered for 3 years, excluding fabrics and foam. Foam in upholstered items is covered for 5 years."],
    ["Making a claim", "Contact our team with proof of purchase and photographs of the issue. We may inspect the item or request its return before assessing a claim. Contact us for the full warranty terms and outdoor furniture details."],
  ],
  "pages/care-maintenance": [
    ["Timber — lacquer", "Keep timber away from prolonged direct sunlight, air conditioning, heat and excess moisture. Wipe with a clean, damp microfibre cloth in the direction of the grain, then dry immediately. Wipe spills promptly and use mats to protect against scratches and moisture."],
    ["Powder-coated steel and metals", "Clean gently with a soft cloth and mild detergent, rinse and dry. Avoid abrasive pads and harsh chemicals, particularly on brushed stainless steel."],
    ["Marble and stone", "Use warm water and a clean cloth or a suitable stone cleaner. Avoid acidic products, protect the surface from scratches and heat, and wipe spills promptly."],
    ["Leather and fabrics", "Keep upholstery away from direct sun and excess heat. Vacuum regularly with a soft brush. Blot fabric spills rather than rubbing, and follow the care instructions for the specific textile or leather."],
    ["Sofas and outdoor furniture", "Turn and plump loose cushions regularly. Clean outdoor furniture every one to two months and re-oil Iroko at least annually; store cushions dry and avoid pressure washing or abrasive cleaners."],
  ],
  "pages/care-and-maintenance": [
    ["Timber — lacquer", "Keep timber away from prolonged direct sunlight, air conditioning, heat and excess moisture. Wipe with a clean, damp microfibre cloth in the direction of the grain, then dry immediately. Wipe spills promptly and use mats to protect against scratches and moisture."],
    ["Powder-coated steel and metals", "Clean gently with a soft cloth and mild detergent, rinse and dry. Avoid abrasive pads and harsh chemicals, particularly on brushed stainless steel."],
    ["Marble and stone", "Use warm water and a clean cloth or a suitable stone cleaner. Avoid acidic products, protect the surface from scratches and heat, and wipe spills promptly."],
    ["Leather, fabrics and sofas", "Vacuum upholstery regularly with a soft brush, keep it out of direct sunlight, and blot spills rather than rubbing. Turn and plump loose cushions to help them retain their shape."],
  ],
  "pages/faqs": [
    ["What fabrics can Wood Pattarai use?", "We can access fabrics from New Zealand fabric houses including James Dunlop, Warwick, Textilia, Unique Fabrics and Senica. A curated selection is offered for each upholstered piece; contact the team about other fabrics or leathers."],
    ["What timber do you use?", "Most furniture is made with solid American Ash and Oak hardwood, kiln dried for stability."],
    ["Where is the furniture made?", "Wood Pattarai manufactures furniture in its own timber and upholstery factories in Motueka, Tasman, New Zealand."],
    ["Can I customise a piece?", "Custom requests are considered case by case and may incur a standard design fee. Contact the team to discuss your requirements."],
    ["How long does an order take?", "Standard manufacturing is generally 6–10 weeks, depending on materials. Delivery usually takes another 1–2 weeks, depending on location."],
    ["How does payment work?", "A deposit is required to secure production, with the balance due when the furniture is complete. Credit card payments incur a 3% surcharge."],
    ["Can I cancel or return an order?", "Made-to-order furniture cannot be cancelled or refunded for a change of mind after one business day. Contact Wood Pattarai promptly if an item arrives damaged."],
  ],
  "pages/trade": [
    ["Trade partnership", "Wood Pattarai works with interior designers, architects, developers and specifiers on residential and commercial projects. Trade partners can access project support, tailored benefits, curated material samples and a partner web portal."],
    ["Apply for a trade account", "Contact hello@woodwrights.co.nz to discuss a trade account, or use the application page to provide your business and reference details."],
  ],
  "pages/trade-signup": [
    ["Trade account application", "We welcome architects, designers and specifiers to our trade partnership. Applications include business details, primary contact information, trade references and accounts contact details. The team will be in touch to discuss next steps."],
  ],
};

function InformationPage({ route }: { route: WoodpattaraiRoute }) {
  const sections = informationSections[route.path];
  const isPolicy = route.kind === "policy";

  return (
    <>
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Wood Pattarai / Information</p>
        <h1>{route.title}</h1>
        <p>{sections?.[0]?.[1] ?? (isPolicy ? "Our terms and policies explain how we work with you and handle your information. Please contact our team if you need help understanding any part of these documents." : `Find information about ${route.title.toLowerCase()} below, or contact our team for help with your order or project.`)}</p>
      </section>
      <section className={styles.informationSections}>
        {(sections ?? [["Please contact our team", "For the full current information, please contact our team at hello@woodwrights.co.nz or 09 280 3722."]]).map(([title, text]) => (
          <details className={styles.informationAccordion} key={title} open={sections?.length === 1}>
            <summary>{title}<span aria-hidden="true">+</span></summary>
            <p>{text}</p>
          </details>
        ))}
      </section>
      <p className={styles.informationContact}>Need a hand? <a href="/pages/contact">Contact our team ↗</a></p>
    </>
  );
}

function DestinationContent({ route }: { route: WoodpattaraiRoute }) {
  if (route.kind === "product") return <ProductPage productHandle={route.path.replace("products/", "")} />;
  if (route.kind === "collection") return <CollectionPage route={route} />;
  if (route.kind === "search") return <WoodwrightsSearch />;
  if (route.kind === "cart") return <WoodwrightsCart />;

  if (route.kind === "materials") {
    return (
      <>
        <section className={styles.pageIntro}>
          <p className={styles.eyebrow}>Materials / Personalise your piece</p>
          <h1>Materials</h1>
          <p>{route.description}</p>
        </section>
        <div className={styles.materialLayout}>
          <div className={styles.materialImage}><Image src="/sites/woodpattarai/spaces.webp" alt="Natural upholstery and timber samples" fill sizes="(max-width: 760px) 100vw, 54vw" /></div>
          <div className={styles.materialList}>
            <p className={styles.eyebrow}>Explore the library</p>
            {materials.map((material, index) => <a href={`#${material.toLowerCase()}`} key={material}><span>0{index + 1}</span>{material}<span aria-hidden="true">↗</span></a>)}
            <p className={styles.smallNote}>Request up to six material samples free of charge.</p>
          </div>
        </div>
        <WoodwrightsMaterialLibrary />
      </>
    );
  }

  if (route.kind === "about") return <EditorialPage route={route} />;

  if (route.kind === "resources") {
    return (
      <>
        <section className={styles.pageIntro}>
          <p className={styles.eyebrow}>For designers and makers</p>
          <h1>Design Resources</h1>
          <p>{route.description}</p>
        </section>
        <p className={styles.resourceNote}>Search below to access product-specific resources, including 3D files for ArchiCAD, AutoCAD, SketchUp and Revit, as well as specification sheets.</p>
        <WoodwrightsResourceCatalog products={getWoodwrightsProductsForCollection("all")} />
      </>
    );
  }

  if (route.kind === "showroom") {
    return (
      <>
        <section className={styles.pageIntro}>
          <p className={styles.eyebrow}>Auckland / Grey Lynn</p>
          <h1>Visit our showroom</h1>
          <p>{route.description}</p>
        </section>
        <section className={styles.showroomGrid} id="location">
          <div className={styles.showroomImage}><Image src="/sites/woodpattarai/showroom-auckland.webp" alt="Auckland furniture showroom" fill sizes="(max-width: 760px) 100vw, 66vw" /></div>
          <div className={styles.showroomDetails}>
            <p className={styles.eyebrow}>Auckland Showroom</p>
            <h2>Come experience the collection.</h2>
            <p>1/299 Great North Road<br />Grey Lynn, Auckland 1021</p>
            <p>Access to the car park is via Grosvenor Street.</p>
            <dl className={styles.showroomHours}>
              <div><dt>Monday–Friday</dt><dd>9am–4pm</dd></div>
              <div><dt>Saturday–Sunday</dt><dd>Closed</dd></div>
            </dl>
            <a href="tel:+6492803722">09 280 3722</a>
            <a href="mailto:hello@woodwrights.co.nz">hello@woodwrights.co.nz</a>
            <a href="https://maps.google.com/?q=1%2F299+Great+North+Road%2C+Grey+Lynn%2C+Auckland+1021" target="_blank" rel="noreferrer">Get directions ↗</a>
            <a className={styles.textLink} href="/collections/on-display-in-auckland">Items on display ↗</a>
            <a className={styles.textLink} href="/pages/contact">Contact us about a visit ↗</a>
          </div>
        </section>
      </>
    );
  }

  if (route.kind === "contact") {
    return (
      <>
        <section className={styles.pageIntro}>
          <p className={styles.eyebrow}>We’re here to help</p>
          <h1>Contact</h1>
          <p>{route.description}</p>
        </section>
        <section className={styles.contactGrid}>
          <div>
            <p className={styles.eyebrow}>Showroom</p>
            <h2>Auckland</h2>
            <p>1/299 Great North Road<br />Grey Lynn, Auckland 1021</p>
            <a href="tel:+6492803722">09 280 3722</a>
          </div>
          <div>
            <p className={styles.eyebrow}>Head Office & Manufacturing</p>
            <h2>Motueka</h2>
            <p>37 College Street<br />Motueka 7120</p>
            <a href="mailto:hello@woodwrights.co.nz">hello@woodwrights.co.nz</a>
            <a href="tel:+6435289200">03 528 9200</a>
          </div>
        </section>
        <section className={styles.contactFormSection}>
          <p className={styles.eyebrow}>Enquire</p>
          <h2>Send us a message</h2>
          <p>We’re here to assist with product advice, orders and your next project.</p>
          <WoodwrightsContactForm />
        </section>
      </>
    );
  }

  if (route.kind === "account") {
    return (
      <section className={styles.pageIntro}>
        <p className={styles.eyebrow}>Wood Pattarai / Account</p>
        <h1>My Account</h1>
        <p>Account sign-in is not connected in this local preview. Contact our team for help with an order or an existing account.</p>
        <a className={styles.primaryLink} href="/pages/contact">Contact our team <span aria-hidden="true">↗</span></a>
      </section>
    );
  }

  return <InformationPage route={route} />;

}

export function WoodpattaraiDestination({ route }: { route: WoodpattaraiRoute }) {
  const breadcrumbTitle = getWoodpattaraiRouteTitle(route.path) ?? route.title;

  return (
    <div className={styles.page}>
      <WoodwrightsAnnouncement />
      <SiteHeader />
      <main>
        <div className={styles.breadcrumb}><a href="/">Home</a><span>/</span>{breadcrumbTitle}</div>
        <DestinationContent route={route} />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <a className={styles.brand} href="/">WOOD PATTARAI</a>
          <p>Furniture shaped by honesty and elegance.</p>
        </div>
        <div className={styles.footerColumn}>
          <h2>Information</h2>
          <a href="/collections/exdisplay">Ex Display</a>
          <a href="/pages/lead-times">Lead Times</a>
          <a href="/pages/shipping">Delivery</a>
          <a href="/pages/warranty">Warranty</a>
          <a href="/pages/care-and-maintenance">Care &amp; Maintenance</a>
          <a href="/policies/terms-of-service">Terms &amp; Conditions</a>
          <a href="/policies/privacy-policy">Privacy Policy</a>
          <a href="/pages/terms-of-trade">Terms of Trade</a>
        </div>
        <div className={styles.footerColumn}>
          <h2>Support</h2>
          <a href="/pages/resources">Design Resources</a>
          <a href="/pages/contact">Contact Us</a>
          <a href="/pages/showroom">Showroom</a>
          <a href="/pages/trade-signup">Trade Accounts</a>
          <a href="/pages/faqs">FAQs</a>
        </div>
        <div className={styles.footerColumn}>
          <h2>Inspiration</h2>
          <a href="https://www.instagram.com/woodwrights_nz/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.facebook.com/woodwrightsfurniture" target="_blank" rel="noreferrer">Facebook</a>
        </div>
        <div className={styles.footerNewsletter}>
          <h2>Sign up to our newsletter</h2>
          <p>Be the first to hear about our latest news, collections and product arrivals.</p>
          <WoodwrightsNewsletter />
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026, WOOD PATTARAI. All rights reserved.</span>
          <a href="/policies/privacy-policy">Privacy Policy</a>
          <a href="/policies/terms-of-service">Terms &amp; Conditions</a>
          <a href="https://almond.studio/" target="_blank" rel="noreferrer">Site by S/A</a>
        </div>
      </footer>
      <WoodwrightsAssistant />
    </div>
  );
}
