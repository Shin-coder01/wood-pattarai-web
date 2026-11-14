"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { WoodwrightsProduct } from "./woodwrights-products";
import styles from "./woodwrights-resource-catalog.module.css";

export function WoodwrightsResourceCatalog({ products }: { products: readonly WoodwrightsProduct[] }) {
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return normalizedQuery
      ? products.filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      : products;
  }, [products, query]);

  return (
    <section className={styles.catalog} aria-label="Product design resources">
      <label className={styles.search}>
        <span>Search products</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product name" type="search" />
        <span aria-hidden="true">⌕</span>
      </label>
      <a className={styles.textureCard} href="/pages/contact?resource=timber-textures">
        <span className={styles.textureImage} aria-hidden="true"><Image src="/sites/woodpattarai/approach-warmth.webp" alt="" fill sizes="(max-width: 760px) 100vw, 35vw" /></span>
        <span className={styles.textureCopy}><span>Timber textures</span><strong>Download <span aria-hidden="true">↗</span></strong></span>
      </a>
      <div className={styles.resultsHeading}>
        <p>{query ? `Search results (${filteredProducts.length})` : "Product resources"}</p>
        {query ? <button type="button" onClick={() => setQuery("")}>Clear search</button> : <span>{filteredProducts.length} products</span>}
      </div>
      {filteredProducts.length ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <article className={styles.card} key={product.handle}>
              <a className={styles.image} href={`/products/${product.handle}`} aria-label={`View ${product.name}`}>
                <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 760px) 50vw, 25vw" />
              </a>
              <h2><a href={`/products/${product.handle}`}>{product.name}</a></h2>
              <a className={styles.download} href={`/pages/contact?resource=${encodeURIComponent(product.name)}`}>
                Download 3D Models <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.viewProduct} href={`/products/${product.handle}`}>View Product</a>
            </article>
          ))}
          {filteredProducts.length === 0 ? <p>No products match that search.</p> : null}
        </div>
      ) : <p className={styles.empty}>No products match “{query}”. Try another name.</p>}
      <p className={styles.note}>For product-specific 3D models and specification sheets, contact our team and include the product name in your request.</p>
    </section>
  );
}
