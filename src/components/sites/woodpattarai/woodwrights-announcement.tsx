"use client";

import { useState } from "react";
import styles from "./woodpattarai-destination.module.css";

export function WoodwrightsAnnouncement() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={styles.announcementBar}>
      <a href="/pages/showroom">Visit our Grey Lynn showroom</a>
      <button type="button" aria-label="Dismiss announcement" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
