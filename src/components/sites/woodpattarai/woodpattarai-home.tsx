"use client";

import Image from "next/image";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./woodpattarai-home.module.css";
import { MorsLightExperience } from "@/app/light-demo/MorsLightExperience";
import { WoodwrightsAssistant } from "./woodwrights-assistant";
import { shopGroups } from "./woodpattarai-navigation";

function siteHref(path: string) {
  return path;
}

const approaches = [
  {
    number: "01",
    title: "Spirit etched in place",
    copy: "Anchored in Tasmanâ€™s gentle coastlines and abundant orchards, WOOD PATTARAI design is guided by the character of its surroundings. The rhythm of the land, the clarity of the air and the resilience of its people are woven into the making process.",
    image: "/sites/woodpattarai/approach-spirit.webp",
    alt: "Golden light on the Tasman coast",
  },
  {
    number: "02",
    title: "Warmth into every space",
    copy: "Each WOOD PATTARAI piece carries a quiet warmth that transforms the spaces we move through every day. From the soft grain of timber to the smooth curve of an armrest, materials are chosen for their ability to invite touch and capture light.",
    image: "/sites/woodpattarai/products/ebb-bar-stool.webp",
    alt: "Handcrafted oak bar stools with cream upholstery",
  },
  {
    number: "03",
    title: "Built to age with grace",
    copy: "WOOD PATTARAI furniture is made by local hands using enduring materials and time-honoured techniques that only grow richer with use. Each joint, seam and surface is considered for strength and longevity â€“ reflecting the quiet permanence of Tasmanâ€™s weathered stone and golden sands.",
    image: "/sites/woodpattarai/approach-longevity.webp",
    alt: "Furniture being crafted in a New Zealand workshop",
  },
  {
    number: "04",
    title: "Design you feel, service you trust",
    copy: "From first consultation to delivery, WOOD PATTARAIâ€™s team work with care, clarity and integrity. With fast lead times, ongoing care and enduring service, WOOD PATTARAI makes good design feel effortless.",
    image: "/sites/woodpattarai/approach-service.webp",
    alt: "A selection of tactile upholstery and timber samples",
  },
] as const;

const products = [
  {
    title: "Oliver Sofa - Preset A",
    price: "From $21,507.50",
    image: "/sites/woodpattarai/products/sofa-oatmeal.webp",
  },
  {
    title: "Oliver Sofa - Preset B",
    price: "From $18,410",
    image: "/sites/woodpattarai/products/sofa-sage.webp",
  },
  {
    title: "Oliver Sofa - Preset C",
    price: "From $18,410",
    image: "/sites/woodpattarai/products/sofa-clay.webp",
  },
] as const;

const roomCollections = [
  {
    label: "Living Room",
    image: "/sites/woodpattarai/room-living.webp",
    href: siteHref("/collections/living"),
  },
  {
    label: "Dining Room",
    image: "/sites/woodpattarai/room-dining.webp",
    href: siteHref("/collections/dining"),
  },
  {
    label: "Bedroom",
    image: "/sites/woodpattarai/room-bedroom.webp",
    href: siteHref("/collections/bedroom"),
  },
] as const;

function Icon({ name }: { name: "menu" | "close" | "search" | "account" | "bag" | "arrow" | "lamp" | "sliders" }) {
  const common = {
    "aria-hidden": true as const,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.35,
    viewBox: "0 0 24 24",
  };

  if (name === "menu") {
    return <svg {...common}><path d="M3.5 7h17M3.5 12h17M3.5 17h17" /></svg>;
  }
  if (name === "close") {
    return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  }
  if (name === "search") {
    return <svg {...common}><circle cx="10.8" cy="10.8" r="6.7" /><path d="m16 16 4.3 4.3" /></svg>;
  }
  if (name === "account") {
    return <svg {...common}><circle cx="12" cy="7.5" r="3.2" /><path d="M5.3 20c.8-3.5 3.1-5.2 6.7-5.2s5.9 1.7 6.7 5.2" /></svg>;
  }
  if (name === "bag") {
    return <svg {...common}><path d="M5.2 8.7h13.6l1 12H4.2l1-12Z" /><path d="M8.5 9V6.4a3.5 3.5 0 0 1 7 0V9" /></svg>;
  }
  if (name === "lamp") {
    return <svg {...common}><path d="M7 4h10l3 7H4l3-7Z" /><path d="M12 11v7m-5 0h10m-9 0v2h8v-2" /></svg>;
  }
  if (name === "sliders") {
    return <svg {...common}><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>;
  }
  return <svg {...common}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

function NewsletterForm({
  onSubmit,
  success,
  compact = false,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  success: boolean;
  compact?: boolean;
}) {
  if (success) {
    return <p className={styles.successMessage}>Thank you for signing up to our newsletter.</p>;
  }

  return (
    <form className={compact ? styles.footerForm : styles.popupForm} onSubmit={onSubmit}>
      <input aria-label="Name" name="name" placeholder="Name" autoComplete="name" />
      <input aria-label="Email" name="email" placeholder="Email" type="email" autoComplete="email" required />
      <button type="submit">Subscribe <span aria-hidden="true">â†—</span></button>
    </form>
  );
}

export default function WoodpattaraiHome({ initialRoomBright }: { initialRoomBright: boolean }) {
  const heroMediaRef = useRef<HTMLPictureElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawer, setDrawer] = useState<"cart" | "search" | null>(null);
  const [approachIndex, setApproachIndex] = useState(0);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [roomBright, setRoomBrightState] = useState(initialRoomBright);
  const [roomTransitionReady, setRoomTransitionReady] = useState(false);

  const setRoomBright = (bright: boolean) => {
    setRoomBrightState(bright);
    document.cookie = `woodpattarai-room-bright=${bright}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };
  useEffect(() => {
    setRoomTransitionReady(true);
    if (window.sessionStorage.getItem("woodpattarai-newsletter-dismissed")) return;
    const timer = window.setTimeout(() => setNewsletterOpen(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        setMobileMenuOpen(false);
        setDrawer(null);
        setNewsletterOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const dismissNewsletter = () => {
    setNewsletterOpen(false);
    window.sessionStorage.setItem("woodpattarai-newsletter-dismissed", "1");
  };

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  return (
    <div
      className={styles.site}
      data-room-bright={roomBright}
      data-room-transition-ready={roomTransitionReady}
    >
      {announcementVisible && (
        <div className={styles.announcement}>
          <a href={siteHref("/pages/showroom")}>Visit our Grey Lynn showroom</a>
          <button type="button" aria-label="Close announcement" onClick={() => setAnnouncementVisible(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}

      <main>
        <section
          className={styles.hero}
          aria-label="WOOD PATTARAI furniture collection"
          data-mors-light="true"
        >
          <picture ref={heroMediaRef} className={styles.heroMedia}>
            <source media="(max-width: 760px)" srcSet="/sites/woodpattarai/hero-mobile.webp" />
            <Image
              ref={heroImageRef}
              src="/sites/woodpattarai/hero-desktop.webp"
              alt="A calm living room with a pale modular sofa and timber furniture"
              fill
              priority
              sizes="100vw"
              className={styles.heroImage}
            />
          </picture>
          <MorsLightExperience
            mediaRef={heroMediaRef}
            imageRef={heroImageRef}
            roomBright={roomBright}
            onRoomBrightChange={setRoomBright}
          />
          <div className={styles.heroShade} />
          <header className={styles.header} data-shop-open={shopOpen} onMouseLeave={() => setShopOpen(false)}>
            <a href="/" className={styles.mobileWordmark} aria-label="WOOD PATTARAI home">
              <span>WOOD PATTARAI</span>
            </a>
            <nav className={styles.desktopNavigation} aria-label="Main navigation">
              <div className={styles.shopNavigation} onMouseEnter={() => setShopOpen(true)}>
                <button type="button" aria-expanded={shopOpen} onClick={() => setShopOpen((open) => !open)}>
                  Shop
                </button>
                {shopOpen && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaMenuIntro}>
                      <span>Explore the collection</span>
                      <a href={siteHref("/collections/all")}>Shop all <Icon name="arrow" /></a>
                    </div>
                    {shopGroups.map((group) => (
                      <div className={styles.megaMenuGroup} key={group.title}>
                        <h2>{group.title}</h2>
                        {group.items.map(([label, href]) => (
                          <a href={siteHref(href)} key={label}>{label}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a href={siteHref("/pages/materials")}>Materials</a>
              <a href={siteHref("/pages/about")}>About</a>
              <a href={siteHref("/pages/resources")}>Resources</a>
              <a href={siteHref("/pages/showroom")}>Showroom</a>
              <a href={siteHref("/pages/contact")}>Contact</a>
            </nav>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.mobileMenuToggle}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} />
              </button>
              <button type="button" aria-label="Search" onClick={() => setDrawer("search")}>
                <Icon name="search" />
              </button>
              <a href={siteHref("/account/login")} aria-label="Account" className={styles.accountAction}>
                <Icon name="account" />
              </a>
              <button type="button" aria-label="Open cart" onClick={() => setDrawer("cart")}>
                <Icon name="bag" />
              </button>
            </div>
          </header>

          {mobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <button className={styles.mobileShopButton} type="button" onClick={() => setShopOpen((open) => !open)}>
                Shop <span>{shopOpen ? "âˆ’" : "+"}</span>
              </button>
              {shopOpen && shopGroups.map((group) => (
                <div className={styles.mobileShopGroup} key={group.title}>
                  <p>{group.title}</p>
                  {group.items.map(([label, href]) => (
                    <a href={siteHref(href)} key={label} onClick={() => setMobileMenuOpen(false)}>{label}</a>
                  ))}
                </div>
              ))}
              <a href={siteHref("/pages/materials")} onClick={() => setMobileMenuOpen(false)}>Materials</a>
              <a href={siteHref("/pages/about")} onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href={siteHref("/pages/resources")} onClick={() => setMobileMenuOpen(false)}>Resources</a>
              <a href={siteHref("/pages/showroom")} onClick={() => setMobileMenuOpen(false)}>Showroom</a>
              <a href={siteHref("/pages/contact")} onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
          )}

            <a href="/" className={styles.heroWordmark} aria-label="WOOD PATTARAI home">WOOD PATTARAI</a>
          <div className={styles.heroCaptionTrack}>
            <p className={styles.heroCaption}>Objects of craft, made to be lived with.</p>
          </div>
        </section>

        <section className={styles.collections} id="collections">
          <div className={styles.collectionsCopy}>
            <div className={styles.collectionsIntro}>
              <h1>A new season at our Grey Lynn showroom, shaped by texture, layering and pieces that gather character as they witness life.</h1>
              <a className={styles.underlinedLink} href={siteHref("/collections/all")}>
                Explore our collection <Icon name="arrow" />
              </a>
            </div>
            <div className={styles.spaceLinks}>
              <p className={styles.overline}>Browse by Space</p>
              <a href={siteHref("/collections/living")}><span>01</span><span>Living Room</span><Icon name="arrow" /></a>
              <a href={siteHref("/collections/dining")}><span>02</span><span>Dining Room</span><Icon name="arrow" /></a>
              <a href={siteHref("/collections/bedroom")}><span>03</span><span>Bedroom</span><Icon name="arrow" /></a>
            </div>
          </div>
          <div className={styles.collectionsImage}>
            <Image src="/sites/woodpattarai/spaces.webp" alt="Detail of textured upholstery and natural fibres" fill sizes="(max-width: 760px) 100vw, 52vw" />
          </div>
        </section>

        <section className={styles.approach} id="approach">
          <div className={styles.approachTop}>
            <h2>Our approach</h2>
            <div className={styles.approachContent}>
              <div className={styles.approachTabs} role="tablist" aria-label="Our approach">
                {approaches.map((item, index) => (
                  <button
                    key={item.number}
                    type="button"
                    role="tab"
                    aria-selected={index === approachIndex}
                    aria-controls="approach-panel"
                    onClick={() => setApproachIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                        event.preventDefault();
                        setApproachIndex((current) => (current + 1) % approaches.length);
                      }
                      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        setApproachIndex((current) => (current + approaches.length - 1) % approaches.length);
                      }
                    }}
                  >
                    <span>{item.number}</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
              <div className={styles.approachDescription} id="approach-panel" role="tabpanel" aria-live="polite">
                <p>{approaches[approachIndex].copy}</p>
                <a className={styles.underlinedLink} href={siteHref("/pages/about")}>
                  Read more <Icon name="arrow" />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.approachGallery} aria-label="Approach stories">
            {approaches.map((item, index) => (
              <button
                className={styles.approachImage}
                data-active={index === approachIndex}
                style={{ order: index === approachIndex ? -1 : index }}
                type="button"
                key={item.number}
                aria-label={`Show ${item.title}`}
                aria-pressed={index === approachIndex}
                onClick={() => setApproachIndex(index)}
              >
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 72vw, 28vw" />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.featureProduct} id="ebb-bar-stool">
          <div className={styles.featureProductVisual}>
            <div className={styles.featureProductImage}>
              <Image src="/sites/woodpattarai/products/ebb-bar-stool.webp" alt="Handcrafted oak bar stools with cream upholstery" fill sizes="(max-width: 760px) 100vw, 55vw" />
            </div>
            <a className={styles.imageInfo} href={siteHref("/collections/barstool-1")}>Info</a>
          </div>
          <div className={styles.featureProductCopy}>
            <h2>Ebb Bar Stool</h2>
            <p>Ebb pairs strong, simple forms with refined details. The single rear leg and T-shaped backrest give a distinctive silhouette that holds its own in a room. Available with or without a timber back and in two heights.</p>
            <a className={styles.underlinedLink} href={siteHref("/collections/barstool-1")}>
              Explore further <Icon name="arrow" />
            </a>
          </div>
        </section>

        <section className={styles.featured} id="oliver-sofa">
          <div className={styles.featuredCopy}>
            <p className={styles.overline}>Featured</p>
            <h2>Oliver Modular Sofa</h2>
            <p>Oliver is a modular sofa defined by its softened, continuous form and grounded presence. Sweeping arms create a sense of visual lightness, while generous cushioning invites relaxed, sink-in comfort.</p>
            <p className={styles.collaboration}>Designed in collaboration with Kristen Basra.</p>
            <a className={styles.underlinedLink} href={siteHref("/collections/sofas")}>
              Browse Collection <Icon name="arrow" />
            </a>
            <p className={styles.featuredProductLabel}>OLIVER SOFA - PRESET A</p>
          </div>
          <div className={styles.productList}>
            {products.map((product) => (
              <a className={styles.productCard} href={siteHref("/collections/sofas")} key={product.title}>
                <div className={styles.productImage}>
                  <Image src={product.image} alt={product.title} fill sizes="(max-width: 760px) 100vw, 48vw" />
                  <span className={styles.productArrow}><Icon name="arrow" /></span>
                </div>
                <div className={styles.productDetails}>
                  <span>{product.title}</span>
                  <span>{product.price}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.filmSection} aria-label="WOOD PATTARAI craft and showroom film">
          <video className={styles.film} autoPlay loop muted playsInline poster="/sites/woodpattarai/products/ebb-bar-stool.webp">
            <source src="/sites/woodpattarai/showroom-film.mp4" type="video/mp4" />
          </video>
          <p>Made for the way we live.</p>
        </section>

        <section className={styles.showroom} id="showroom">
          <div className={styles.showroomIntro}>
            <p className={styles.overline}>Visit us</p>
            <h2>Visit our showroom to share the WOOD PATTARAI experience with us.</h2>
          </div>
          <div className={styles.showroomGallery}>
            <div className={styles.showroomMain}>
              <a className={styles.showroomMainImage} href={siteHref("/pages/showroom")} aria-label="Visit Auckland showroom">
                <Image src="/sites/woodpattarai/showroom-auckland.webp" alt="Auckland showroom with WOOD PATTARAI furniture and considered interior details" fill sizes="(max-width: 760px) 100vw, 60vw" />
              </a>
              <a className={styles.showroomLabel} href={siteHref("/pages/showroom")}>Auckland Showroom</a>
            </div>
            <div className={styles.showroomSecondaryImage}>
              <Image src="/sites/woodpattarai/showroom-detail.webp" alt="Furniture and materials inside the Grey Lynn showroom" fill sizes="(max-width: 760px) 100vw, 35vw" />
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <a href="/" className={styles.footerWordmark} aria-label="WOOD PATTARAI home">WOOD PATTARAI</a>
          <p>NZ made quality furniture.<br />Designed to be lived with.</p>
        </div>
        <div className={styles.footerColumn} id="information">
          <h2>Information</h2>
          <a href={siteHref("/pages/ex-display")}>Ex Display</a>
          <a href={siteHref("/pages/lead-times")}>Lead Times</a>
          <a href={siteHref("/pages/delivery")}>Delivery</a>
          <a href={siteHref("/pages/warranty")}>Warranty</a>
          <a href={siteHref("/pages/care-maintenance")}>Care &amp; Maintenance</a>
          <a href={siteHref("/policies/terms-of-service")}>Terms &amp; Conditions</a>
          <a href={siteHref("/pages/terms-of-trade")}>Terms of Trade</a>
          <a href={siteHref("/policies/privacy-policy")}>Privacy Policy</a>
        </div>
        <div className={styles.footerColumn}>
          <h2>Support</h2>
          <a href={siteHref("/pages/resources")}>Design Resources</a>
          <a href={siteHref("/pages/contact")}>Contact Us</a>
          <a href={siteHref("/pages/showroom")}>Showroom</a>
          <a href={siteHref("/pages/trade")}>Trade Accounts</a>
          <a href={siteHref("/pages/faqs")}>FAQs</a>
        </div>
        <div className={styles.footerColumn} id="inspiration">
          <h2>Inspiration</h2>
          <span>Instagram profile coming soon</span>
          <span>Facebook profile coming soon</span>
        </div>
        <div className={styles.footerNewsletter}>
          <h2>Sign up to our newsletter</h2>
          <p>Be the first to hear about our latest news, collections and product arrivals.</p>
          <NewsletterForm onSubmit={subscribe} success={newsletterSent} compact />
        </div>
        <div className={styles.footerBottom}>
          <span>Â© 2026, WOOD PATTARAI. All rights reserved.</span>
          <a href={siteHref("/policies/privacy-policy")}>Privacy Policy</a>
          <a href={siteHref("/policies/terms-of-service")}>Terms &amp; Conditions</a>
          <span>Site by S/A</span>
        </div>
      </footer>

      {drawer && (
        <div className={styles.drawerBackdrop} onMouseDown={() => setDrawer(null)}>
          <aside
            className={drawer === "cart" ? styles.cartDrawer : styles.searchDrawer}
            role="dialog"
            aria-modal="true"
            aria-label={drawer === "cart" ? "Your cart" : "Search WOOD PATTARAI"}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h2>{drawer === "cart" ? "Your Cart" : "Search"}</h2>
              <button type="button" aria-label="Close panel" onClick={() => setDrawer(null)}><Icon name="close" /></button>
            </div>
            {drawer === "cart" ? (
              <>
                <div className={styles.cartSamples}>
                  <p className={styles.overline}>Samples</p>
                  <p>Request up to six material samples free of charge.</p>
                </div>
                <div className={styles.cartEmpty}>Your cart is empty</div>
                <div className={styles.cartSubtotal}><span>Subtotal</span><span>$0</span></div>
                <p className={styles.cartDelivery}>Shipping and delivery are calculated at checkout.</p>
                <button className={styles.continueButton} type="button" onClick={() => setDrawer(null)}>Continue Shopping</button>
                <div className={styles.drawerCollections}>
                  <h3>Explore Our Collections</h3>
                  <div>
                    {roomCollections.map((room) => (
                      <a href={room.href} key={room.label}>
                        <Image src={room.image} alt="" fill sizes="120px" />
                        <span>{room.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <form className={styles.searchForm} action="/">
                <label htmlFor="woodpattarai-search">What are you looking for?</label>
                <div>
                  <input id="woodpattarai-search" name="q" placeholder="Search products and collections" autoFocus />
                  <button type="submit" aria-label="Submit search"><Icon name="search" /></button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}

      {newsletterOpen && (
        <section className={styles.newsletterPopup} role="dialog" aria-label="Sign up to our newsletter">
          <button className={styles.popupClose} type="button" aria-label="Close newsletter sign-up" onClick={dismissNewsletter}>
            <Icon name="close" />
          </button>
          <h2>Sign up to our newsletter</h2>
          <p>Be one of the first to hear about our latest news, collections and product arrivals.</p>
          <NewsletterForm onSubmit={subscribe} success={newsletterSent} />
        </section>
      )}
      <WoodwrightsAssistant />
    </div>
  );
}
