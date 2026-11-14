"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { WoodwrightsProduct } from "./woodwrights-products";
import styles from "./woodwrights-collection-products.module.css";

type SortOrder = "featured" | "name" | "price-ascending" | "price-descending";

function getPrice(price: string) {
  const numericPrice = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

export function WoodwrightsCollectionProducts({ products }: { products: readonly WoodwrightsProduct[] }) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const sortedProducts = useMemo(() => {
    if (sortOrder === "featured") return products;
    return [...products].sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name);
      const difference = getPrice(a.price) - getPrice(b.price);
      return sortOrder === "price-ascending" ? difference : -difference;
    });
  }, [products, sortOrder]);
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  return (
    <section className={styles.collectionProducts} aria-label="Products in this collection">
      <div className={styles.controls}>
        <span>{products.length} products</span>
        <label>Sort by
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
            <option value="featured">Featured</option>
            <option value="name">Alphabetically, A–Z</option>
            <option value="price-ascending">Price, low to high</option>
            <option value="price-descending">Price, high to low</option>
          </select>
        </label>
      </div>
      {visibleProducts.length ? (
        <div className={styles.grid}>
          {visibleProducts.map((product) => (
            <a className={styles.card} href={`/products/${product.handle}`} key={product.handle}>
              <span className={styles.image}>
                <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 760px) 50vw, 33vw" />
              </span>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.price}>{product.price}</span>
            </a>
          ))}
        </div>
      ) : <p className={styles.empty}>There are currently no pieces in this collection. Contact our team for current availability.</p>}
      {visibleCount < sortedProducts.length ? (
        <button className={styles.loadMore} type="button" onClick={() => setVisibleCount((count) => count + 10)}>
          Load more <span aria-hidden="true">↓</span>
        </button>
      ) : null}
    </section>
  );
}
