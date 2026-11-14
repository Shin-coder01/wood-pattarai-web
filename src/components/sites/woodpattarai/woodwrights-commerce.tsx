"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { woodwrightsProducts } from "./woodwrights-products";
import styles from "./woodpattarai-destination.module.css";

type CartItem = { handle: string; quantity: number };

function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem("woodwrights-cart") ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is CartItem =>
      typeof item === "object" && item !== null &&
      "handle" in item && typeof item.handle === "string" &&
      "quantity" in item && typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event("woodwrights-cart-updated"));
}

export function WoodwrightsCartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readCart().reduce((total, item) => total + item.quantity, 0));
    update();
    window.addEventListener("woodwrights-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("woodwrights-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <a className={styles.commerceLink} href="/cart" aria-label={`Cart, ${count} items`}><span aria-hidden="true">♧</span> Cart{count > 0 ? ` (${count})` : ""}</a>;
}

export function WoodwrightsProductActions({ product }: { product: (typeof woodwrightsProducts)[number] }) {
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = readCart();
    const existing = cart.find((item) => item.handle === product.handle);
    const next = existing
      ? cart.map((item) => item.handle === product.handle ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { handle: product.handle, quantity: 1 }];
    window.localStorage.setItem("woodwrights-cart", JSON.stringify(next));
    setAdded(true);
    notifyCartUpdated();
  };

  return (
    <button className={styles.addToCartButton} type="button" onClick={addToCart}>
        {added ? "Added to cart" : "Add to cart"}
      </button>
  );
}

export function WoodwrightsSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? woodwrightsProducts.filter((product) => product.name.toLowerCase().includes(normalized)).slice(0, 40)
      : woodwrightsProducts.slice(0, 24);
  }, [query]);

  return (
    <section className={styles.searchPage}>
      <div className={styles.pageIntro}>
        <p className={styles.eyebrow}>Wood Pattarai / Search</p>
        <h1>Search</h1>
        <label className={styles.searchInputLabel} htmlFor="woodwrights-search-page">What are you looking for?</label>
        <input id="woodwrights-search-page" className={styles.searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" autoComplete="off" />
      </div>
      <p className={styles.searchResultCount}>{query ? `${results.length} results for “${query}”` : "Popular products"}</p>
      {results.length > 0 ? (
        <div className={styles.productGrid}>
          {results.map((product) => (
            <a className={styles.productCard} href={`/products/${product.handle}`} key={product.handle}>
              <span className={styles.productImage}><Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 760px) 90vw, 25vw" /></span>
              <span className={styles.productName}>{product.name}</span>
              <span className={styles.productMeta}>{product.price}<span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      ) : <p className={styles.emptyCollection}>No products matched your search. Try another name or browse <a href="/collections/all">all furniture</a>.</p>}
    </section>
  );
}

export function WoodwrightsCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const update = () => setItems(readCart());
    update();
    window.addEventListener("woodwrights-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("woodwrights-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const products = items.flatMap((item) => {
    const product = woodwrightsProducts.find((candidate) => candidate.handle === item.handle);
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });
  const subtotal = products.reduce((sum, product) => {
    const amount = Number(product.price.replace(/[^\d.]/g, ""));
    return sum + amount * product.quantity;
  }, 0);

  const remove = (handle: string) => {
    const next = items.filter((item) => item.handle !== handle);
    window.localStorage.setItem("woodwrights-cart", JSON.stringify(next));
    setItems(next);
    notifyCartUpdated();
  };

  return (
    <section className={styles.cartPage}>
      <div className={styles.pageIntro}>
        <p className={styles.eyebrow}>Wood Pattarai / Your selection</p>
        <h1>Your Cart</h1>
      </div>
      <div className={styles.cartSamples}>
        <p className={styles.eyebrow}>Samples</p>
        <p>Request up to six material samples free of charge.</p>
        <a href="/pages/materials">Explore the material library ↗</a>
      </div>
      {products.length ? (
        <div className={styles.cartItems}>
          {products.map((product) => (
            <article className={styles.cartItem} key={product.handle}>
              <div className={styles.cartItemImage}><Image src={product.image} alt={product.name} fill unoptimized sizes="120px" /></div>
              <div><h2>{product.name}</h2><p>{product.price}</p><p>Quantity: {product.quantity}</p><button type="button" onClick={() => remove(product.handle)}>Remove</button></div>
            </article>
          ))}
          <div className={styles.cartSubtotal}><span>Subtotal</span><span>NZ${subtotal.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
          <p className={styles.cartShipping}>Shipping and delivery are calculated at checkout.</p>
          <a className={styles.primaryLink} href="/pages/contact">Continue to enquiry <span aria-hidden="true">↗</span></a>
        </div>
      ) : (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <a className={styles.primaryLink} href="/collections/all">Continue shopping <span aria-hidden="true">↗</span></a>
        </div>
      )}
    </section>
  );
}
