"use client";

import { useState, type FormEvent } from "react";
import type { ContactPageContent } from "@/content/types";

interface ContactFormProps {
  labels: ContactPageContent["formLabels"];
}

export function ContactForm({ labels }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "rounded border border-border bg-white px-3.5 py-3 text-[15px] text-inherit font-heebo";
  const labelClass = "text-[14px] text-text-body-soft";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="name">
          {labels.name}
        </label>
        <input id="name" name="name" type="text" placeholder={labels.namePlaceholder} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="email">
          {labels.email}
        </label>
        <input id="email" name="email" type="email" placeholder={labels.emailPlaceholder} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="topic">
          {labels.topic}
        </label>
        <select id="topic" name="topic" className={inputClass}>
          {labels.topicOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="message">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={labels.messagePlaceholder}
          required
          className={`resize-y ${inputClass}`}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded bg-accent px-8 py-3.5 font-heebo text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {labels.submit}
      </button>
      {status === "sent" && <p className="m-0 text-[14px] text-text-body">{labels.successMessage}</p>}
      {status === "error" && <p className="m-0 text-[14px] text-red-600">{labels.errorMessage}</p>}
    </form>
  );
}
