"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, turnstileToken }),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("error");
      setMessage(body.error ?? "Noe gikk galt");
      return;
    }

    setStatus("done");
    setMessage(body.data.message);
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (status === "done") {
    return <p className="text-sm opacity-70">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Få nye turguider på e-post
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-foreground/10 px-3 py-2"
        />
      </label>
      {siteKey && (
        <Turnstile siteKey={siteKey} onSuccess={(token) => setTurnstileToken(token)} />
      )}
      {status === "error" && <p className="text-sm text-red-600">{message}</p>}
      <button
        type="submit"
        disabled={status === "submitting" || !turnstileToken}
        className="self-start rounded bg-primary px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {status === "submitting" ? "Sender…" : "Meld på"}
      </button>
    </form>
  );
}
