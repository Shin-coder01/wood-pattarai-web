"use client";

import { FormEvent, useState } from "react";
import styles from "./woodpattarai-destination.module.css";

export function WoodwrightsNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return <p className={styles.footerSuccess}>Thank you for signing up to our newsletter.</p>;
  }

  return (
    <form className={styles.footerForm} onSubmit={submit}>
      <label>
        <span>Name</span>
        <input name="name" autoComplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button type="submit">Subscribe <span aria-hidden="true">↗</span></button>
    </form>
  );
}
