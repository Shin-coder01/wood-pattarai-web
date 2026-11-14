"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./woodwrights-material-library.module.css";

type MaterialSample = { name: string; color: string; image?: string };
type MaterialGroup = {
  id: string;
  name: string;
  intro: string;
  samples: readonly MaterialSample[];
};

const materialGroups: readonly MaterialGroup[] = [
  {
    id: "upholstery",
    name: "Upholstery",
    intro: "A considered selection of fabrics for each design. You can also specify and supply your own fabric.",
    samples: [
      { name: "Archive Marsh", color: "#99917c", image: "https://woodwrights.co.nz/cdn/shop/files/400x400_Archive_Marsh.jpg?v=1725578513&width=800" },
      { name: "Archive Dusk", color: "#716b63", image: "https://woodwrights.co.nz/cdn/shop/files/400x400_Archive_Dusk.jpg?v=1723669809&width=800" },
      { name: "Archive Moth", color: "#c3bba9", image: "https://woodwrights.co.nz/cdn/shop/files/400x400_Archive_Moth.jpg?v=1727124858&width=800" },
      { name: "Atlantis Vole", color: "#928a7b", image: "https://woodwrights.co.nz/cdn/shop/files/Atlantis_Vole.png?v=1752129472&width=800" },
      { name: "Atlantis Signet", color: "#a69a84", image: "https://woodwrights.co.nz/cdn/shop/files/Atlantis_Signet.png?v=1752129472&width=800" },
      { name: "Atlantis Alabaster", color: "#d9d0c1", image: "https://woodwrights.co.nz/cdn/shop/files/V3078-52.jpg?v=1752129387&width=800" },
      { name: "Barclay Linen", color: "#c2b8a7", image: "https://woodwrights.co.nz/cdn/shop/files/BarclayLinen.jpg?v=1759364367&width=800" },
      { name: "Barclay Putty", color: "#a79b8b", image: "https://woodwrights.co.nz/cdn/shop/files/BarclayPutty_a6a554bd-e7b3-42e2-9b2d-75ebb0144bc9.jpg?v=1754207801&width=800" },
      { name: "Barclay Mink", color: "#82776c", image: "https://woodwrights.co.nz/cdn/shop/files/BarclayMink.jpg?v=1759364389&width=800" },
      { name: "Bikaina YP25006", color: "#79746c" }, { name: "Bikaina YP25005", color: "#968b7b" },
      { name: "Bikaina YP25004", color: "#b2a28d" }, { name: "Bikaina YP25003", color: "#c7baa7" }, { name: "Bikaina YP25002", color: "#d2c9bb" },
      { name: "Bora Bora Oyster", color: "#cfc8bb" }, { name: "Bora Bora Shell", color: "#b8a99b" }, { name: "Bora Bora Beechwood", color: "#d5c6ab" },
      { name: "Dunes Dark Brown", color: "#5a4639" }, { name: "Dunes Almond", color: "#c8b69f" },
      { name: "Ecriture 0210", color: "#bdb8ad" }, { name: "Ecriture 0240", color: "#8a837a" },
      { name: "Eggy Fauve", color: "#8b6c58" }, { name: "Eggy Sable", color: "#b19d86" }, { name: "Eggy Blanc", color: "#ddd5c8" },
      { name: "Entwine Linen", color: "#d2c9b7" }, { name: "Entwine Riverstone", color: "#9c978c" },
      { name: "Grande Boucle Mink", color: "#8b8177" }, { name: "Grande Boucle Champagne", color: "#c9bda8" }, { name: "Grande Boucle Chocolate", color: "#584438" },
      { name: "Kanvas Sesame", color: "#b7aa93" }, { name: "Kanvas Dove", color: "#b9b7b1" }, { name: "Kanvas Dune", color: "#c8b79f" }, { name: "Kanvas Nougat", color: "#aa9179" },
      { name: "Mahana Sand", color: "#c9bda6" }, { name: "Mahana Moss", color: "#777462" }, { name: "Mahana Bronze", color: "#78604e" },
      { name: "Manade Cappuccino", color: "#a18c78" }, { name: "Manade Sable", color: "#c0ae99" }, { name: "Manade Brun Tabac", color: "#685243" }, { name: "Manade Cafe", color: "#493b32" },
      { name: "Marlo Donkey", color: "#817569" }, { name: "Marlo Otter", color: "#756052" }, { name: "Marlo Husk", color: "#ad9a83" }, { name: "Marlo Molasses", color: "#574338" }, { name: "Marlo Mushroom", color: "#9c9386" },
      { name: "Nuance Camel", color: "#b28d69" }, { name: "Nuance Almond", color: "#c5b29b" }, { name: "Nuance Linen", color: "#d4c9b8" }, { name: "Nuance Dark Brown", color: "#594337" }, { name: "Nuance Cinnamon", color: "#956849" },
      { name: "Ostuni Sand", color: "#c8bca5" }, { name: "Ostuni Driftwood", color: "#a19482" }, { name: "Ostuni Pumice", color: "#d0c8bb" },
      { name: "Raymond Linen", color: "#d3cbbb" }, { name: "Raymond Alabaster", color: "#e0dbd0" }, { name: "Raymond Coffee", color: "#7e6d5e" }, { name: "Raymond Cacao", color: "#59483d" },
      { name: "Rondo Lin", color: "#c7bca9" }, { name: "Rondo Chamois", color: "#b49f83" }, { name: "Rondo Bronze", color: "#78604d" }, { name: "Rondo Sable", color: "#82776b" },
      { name: "Rossellini Mocha", color: "#725c4d" }, { name: "Rossellini Flax", color: "#c6b79e" },
      { name: "Spectrum Granite", color: "#6c6b67" }, { name: "Spectrum Safari", color: "#a39379" }, { name: "Spectrum Bark", color: "#6e5744" }, { name: "Spectrum Marble", color: "#d0cbc0" },
      { name: "Supervio Linen", color: "#c9c1b2" }, { name: "Supervio Oak", color: "#aa9679" }, { name: "Supervio Taupe", color: "#9a8c7b" }, { name: "Supervio Bison", color: "#6f5a4a" },
      { name: "Tahiti Olive", color: "#777761" }, { name: "Tahiti Calico", color: "#d7cbbb" }, { name: "Tahiti Smoke", color: "#8e8b83" }, { name: "Taiga Taupe", color: "#a69b8a" }, { name: "Taiga Chocolat", color: "#55453b" },
    ],
  },
  {
    id: "timber", name: "Timber",
    intro: "Solid American Ash and Oak are finished to bring out the natural grain. Lacquer is available in durable 10% or soft 5% matte finishes.",
    samples: [
      { name: "Organic Oak", color: "#c4a77f" }, { name: "Aged Oak", color: "#8a6e52" }, { name: "Fawn Ash", color: "#bea987" },
      { name: "Bark Ash", color: "#817565" }, { name: "Mid Brown Ash", color: "#806348" }, { name: "Taupe Ash", color: "#9c8d79" },
      { name: "Cinder Ash", color: "#514a41" }, { name: "Warm Walnut", color: "#70503c" }, { name: "Iroko Walnut Outdoor", color: "#9b724e" },
    ],
  },
  { id: "stone", name: "Stone", intro: "Natural stone has its own variation in tone, pattern and character.", samples: [{ name: "Bruno Travertine", color: "#c8b99f" }] },
  { id: "powdercoat", name: "Powdercoat", intro: "Durable colour finishes for selected metal furniture.", samples: [{ name: "Matt Black", color: "#292827" }, { name: "Matt Flaxpod", color: "#4b493e" }, { name: "Medium Bronze", color: "#756451" }, { name: "Dark Bronze", color: "#4c4035" }] },
  { id: "metal", name: "Metal", intro: "Refined metal finishes chosen to complement each piece.", samples: [{ name: "Brushed Stainless", color: "#b5b5b1" }] },
  { id: "handles", name: "Handles", intro: "A considered selection of handle shapes and finishes for storage pieces.", samples: [{ name: "Arpa 22 Rustic", color: "#78614b" }, { name: "Arpa 22 Black", color: "#282724" }, { name: "Cylinder Black", color: "#252422" }, { name: "Dial Dark Bronze", color: "#514337" }, { name: "Dial Antique Brass", color: "#9b7b49" }, { name: "Tala Antique Bronze", color: "#796149" }, { name: "Dial White Bronze", color: "#aaa395" }] },
  { id: "piping", name: "Piping", intro: "Piping adds a tailored finish to selected upholstered furniture.", samples: [{ name: "Marlo Otter", color: "#756052" }, { name: "Marlo Husk", color: "#ad9a83" }, { name: "Marlo Russet", color: "#855b44" }, { name: "Archive Marsh", color: "#99917c" }, { name: "Archive Moth", color: "#c3bba9" }, { name: "Archive Dusk", color: "#716b63" }, { name: "Kanvas Dove", color: "#b9b7b1" }, { name: "Kanvas Nougat", color: "#aa9179" }, { name: "Kanvas Sesame", color: "#b7aa93" }, { name: "Kanvas Dune", color: "#c8b79f" }] },
];

export function WoodwrightsMaterialLibrary() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleSample(name: string) {
    setSelected((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      return current.length < 6 ? [...current, name] : current;
    });
  }

  return (
    <div className={styles.library}>
      <div className={styles.sampleBar}>
        <div><span>Free samples</span><p>Choose up to six materials to request.</p></div>
        <div className={styles.sampleActions}>
          <span>{selected.length} / 6 selected</span>
          {selected.length > 0 ? <a href={`/pages/contact?materials=${encodeURIComponent(selected.join(", "))}`}>Request samples <span aria-hidden="true">↗</span></a> : null}
        </div>
      </div>
      {materialGroups.map((group, groupIndex) => (
        <section className={styles.group} id={group.id} key={group.id} aria-labelledby={`${group.id}-heading`}>
          <div className={styles.groupHeading}>
            <p>{String(groupIndex + 1).padStart(2, "0")} / Material library</p>
            <h2 id={`${group.id}-heading`}>{group.name}</h2>
            <span>{group.intro}</span>
          </div>
          <div className={styles.swatches}>
            {group.samples.map((sample) => {
              const isSelected = selected.includes(sample.name);
              const isDisabled = !isSelected && selected.length >= 6;
              return (
                <article className={styles.swatchCard} key={`${group.id}-${sample.name}`}>
                  <div className={styles.swatch} style={{ backgroundColor: sample.color }} aria-hidden="true">
                    {sample.image ? <Image className={styles.swatchImage} src={sample.image} alt="" fill unoptimized sizes="(max-width: 760px) 50vw, 25vw" /> : null}
                    <span>{sample.name}</span>
                  </div>
                  <div className={styles.swatchMeta}>
                    <span>{sample.name}</span>
                    <button type="button" aria-pressed={isSelected} disabled={isDisabled} onClick={() => toggleSample(sample.name)}>
                      {isSelected ? "Added" : "Request Sample"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      <p className={styles.libraryNote}>Samples are free, with up to six available per request. If you need help choosing finishes for a particular piece, <a href="/pages/contact">talk with our team</a>.</p>
    </div>
  );
}
