"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Send, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-sky-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5",
          "text-sm text-slate-100 placeholder:text-slate-500",
          "outline-none transition-all duration-200",
          "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
          "hover:border-slate-600",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-sky-400 ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        rows={5}
        className={cn(
          "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5",
          "text-sm text-slate-100 placeholder:text-slate-500 resize-y",
          "outline-none transition-all duration-200",
          "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
          "hover:border-slate-600",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
    </div>
  );
}

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/jakejeffreys",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/jake-jeffreys",
    Icon: Linkedin,
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  function setField(field: keyof FormData) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") msg = data.error;
        } catch {
          // ignore parse error
        }
        throw new Error(msg);
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          className="mb-12"
          {...fadeUpProps(0)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sky-400" />
            <span className="text-sky-400 text-sm font-mono tracking-widest uppercase">
              Contact
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Get In Touch
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
            I&apos;m always open to interesting conversations, new opportunities, or just
            talking shop. Drop me a line and I&apos;ll get back to you as soon as I can.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="mx-auto max-w-[600px]"
          {...fadeUpProps(0.1)}
        >
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 sm:p-8 shadow-xl shadow-black/20">
            {isSuccess ? (
              /* Success state */
              <motion.div
                className="flex flex-col items-center gap-4 py-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/40 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    Message sent!
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-2 text-sm text-sky-400 hover:text-sky-300 transition-colors font-mono"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    id="contact-name"
                    label="Name"
                    value={form.name}
                    onChange={setField("name")}
                    disabled={isSubmitting}
                    required
                    autoComplete="name"
                  />
                  <InputField
                    id="contact-email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    disabled={isSubmitting}
                    required
                    autoComplete="email"
                  />
                </div>

                <TextareaField
                  id="contact-message"
                  label="Message"
                  value={form.message}
                  onChange={setField("message")}
                  disabled={isSubmitting}
                  required
                />

                {/* Error banner */}
                {status === "error" && errorMessage && (
                  <motion.div
                    className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-none mt-0.5" />
                    <p className="text-sm text-red-300">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "relative mt-1 inline-flex items-center justify-center gap-2",
                    "rounded-lg px-6 py-3 text-sm font-semibold",
                    "bg-sky-500 text-white",
                    "hover:bg-sky-400 active:bg-sky-600",
                    "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900",
                    "transition-all duration-200",
                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sky-500",
                    "shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          {...fadeUpProps(0.2)}
        >
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel={href !== "#" ? "noopener noreferrer" : undefined}
              aria-label={label}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-full",
                "border border-slate-700 bg-slate-800/60 text-slate-400",
                "hover:border-sky-500/50 hover:bg-slate-800 hover:text-sky-400",
                "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#0a0f1e]",
                "transition-all duration-200 group"
              )}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
