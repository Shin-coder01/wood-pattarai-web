"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./woodwrights-assistant.module.css";

type AssistantReply = {
  text: string;
  href?: string;
  linkLabel?: string;
};

type Message = AssistantReply & {
  id: number;
  role: "assistant" | "visitor";
};

const quickQuestions = [
  "Can I request material samples?",
  "How long does an order take?",
  "Where is the showroom?",
] as const;

function getReply(question: string): AssistantReply {
  const query = question.toLowerCase();

  if (/\b(hi|hello|kia ora|hey)\b/.test(query)) {
    return { text: "Kia ora! What can I help you find today?" };
  }

  if (/material|fabric|upholstery|timber|finish|sample/.test(query)) {
    return {
      text: "You can personalise pieces with upholstery, timber and considered finishes. We also offer up to six complimentary material samples.",
      href: "/pages/materials",
      linkLabel: "Explore materials",
    };
  }

  if (/delivery|shipping|lead time|how long|arrive/.test(query)) {
    return {
      text: "Timber pieces generally take 6–8 weeks to make; pieces using metal or upholstery generally take 8–10 weeks. Delivery is typically 1–2 weeks after dispatch.",
      href: "/pages/delivery",
      linkLabel: "Delivery details",
    };
  }

  if (/showroom|visit|address|location|open|hours/.test(query)) {
    return {
      text: "Our Auckland showroom is at 1/299 Great North Road, Grey Lynn. It is open Monday to Friday, 9am–4pm, and closed on weekends.",
      href: "/pages/showroom",
      linkLabel: "Showroom information",
    };
  }

  if (/care|clean|maintain|warranty/.test(query)) {
    return {
      text: "Care depends on the material and finish. Our care guide covers timber, metals, stone, leather and fabrics.",
      href: "/pages/care-and-maintenance",
      linkLabel: "Care and maintenance",
    };
  }

  if (/trade|designer|architect|account/.test(query)) {
    return {
      text: "We work with interior designers, architects and specifiers. You can send an application to our team through the trade account page.",
      href: "/pages/trade-signup",
      linkLabel: "Trade accounts",
    };
  }

  if (/sofa|chair|table|bed|storage|product|furniture|collection/.test(query)) {
    return {
      text: "We make furniture for living, dining and bedroom spaces. Browse the collection or tell me which room and piece you have in mind.",
      href: "/collections/all",
      linkLabel: "Browse the collection",
    };
  }

  return {
    text: "I can help with furniture, materials, samples, delivery, care or visiting our showroom. For a question that needs our team, send us a message here.",
    href: "/pages/contact",
    linkLabel: "Contact our team",
  };
}

export function WoodwrightsAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Kia ora. Ask me about our furniture, materials, delivery or showroom.",
    },
  ]);
  const nextMessageId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "end" });
  }, [messages, open]);

  const sendQuestion = (question: string) => {
    const text = question.trim();
    if (!text) return;

    const reply = getReply(text);
    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, role: "visitor", text },
      { id: nextMessageId.current++, role: "assistant", ...reply },
    ]);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendQuestion(draft);
  };

  return (
    <div className={styles.root}>
      {open && (
        <section className={styles.panel} role="dialog" aria-label="Wood Pattarai assistant">
          <header className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>WOOD PATTARAI / SUPPORT</p>
              <h2>How can we help?</h2>
            </div>
            <button className={styles.closeButton} type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <div className={styles.messages} role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message) => (
              <article className={message.role === "visitor" ? styles.visitorMessage : styles.assistantMessage} key={message.id}>
                <p>{message.text}</p>
                {message.href && message.linkLabel ? <a href={message.href}>{message.linkLabel}<span aria-hidden="true"> ↗</span></a> : null}
              </article>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.quickQuestions} aria-label="Suggested questions">
              {quickQuestions.map((question) => (
                <button type="button" key={question} onClick={() => sendQuestion(question)}>{question}</button>
              ))}
            </div>
          )}

          <form className={styles.composer} onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              placeholder="Ask us a question"
              aria-label="Ask the Wood Pattarai assistant"
            />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
            </button>
          </form>
        </section>
      )}

      <button
        className={styles.launcher}
        type="button"
        aria-label={open ? "Close Wood Pattarai assistant" : "Open Wood Pattarai assistant"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H10l-5 3v-3.5H4z" /><path d="M8 10h8m-8 3h5" /></svg>
        )}
      </button>
    </div>
  );
}
