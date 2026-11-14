"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "./woodpattarai-destination.module.css";

export function WoodwrightsContactForm() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const resource = query.get("resource");
    const materials = query.get("materials");

    if (resource) setMessage(`Please send me information about ${resource}.`);
    if (materials) setMessage(`Please send me samples of ${materials}.`);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) return <p className={styles.formSuccess}>Thank you for contacting us. We will get back to you shortly.</p>;

  return (
    <form className={styles.contactForm} onSubmit={submit}>
      <label>First name<input name="firstName" autoComplete="given-name" required /></label>
      <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label>
      <label>What can we help with?
        <select name="topic" defaultValue="General enquiry">
          <option>General enquiry</option>
          <option>Product advice</option>
          <option>Material samples</option>
          <option>Design resources</option>
          <option>Existing order</option>
          <option>Trade project</option>
          <option>Showroom visit</option>
        </select>
      </label>
      <label className={styles.contactMessage}>Message<textarea name="message" rows={5} value={message} onChange={(event) => setMessage(event.target.value)} required /></label>
      <button className={styles.primaryLink} type="submit">Send <span aria-hidden="true">↗</span></button>
    </form>
  );
}
