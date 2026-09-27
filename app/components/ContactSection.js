"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { sendEnquiry } from "../actions/contact";
import { SERVICES } from "../lib/services";

// Placeholder contact details — replace with the firm's real ones.
const details = [
  { label: "Email", value: "hello@greystonehyde.co.uk", href: "mailto:hello@greystonehyde.co.uk" },
  { label: "Phone", value: "+44 (0)20 0000 0000", href: "tel:+442000000000" },
  { label: "Office", value: "London, United Kingdom" },
  { label: "Hours", value: "Mon – Fri, 9:00 – 17:30" },
];

const ease = [0.22, 1, 0.36, 1];

const inputClass =
  "mt-2 w-full rounded-xl border border-card-line bg-card-inset px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-300 outline-none focus:border-brand aria-[invalid=true]:border-red-400/70";

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="text-[11px] tracking-[0.18em] text-muted uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactSection() {
  const [state, formAction, pending] = useActionState(sendEnquiry, null);
  const errors = state?.errors ?? {};
  const v = state?.values ?? {};

  const aria = (name) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="contact" className="relative scroll-mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-6 flex items-center gap-4 text-[11px] tracking-[0.28em] text-brand uppercase sm:text-xs">
              <span className="h-px w-10 bg-brand" />
              Contact us
            </p>
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.08] tracking-tight">
              Let&apos;s bring clarity to your finances.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Tell us a little about your business and what you need. A
              qualified accountant will reply within one working day — no
              obligation, no sales script.
            </p>

            <dl className="mt-12 grid gap-3 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="card px-5 py-4">
                  <dt className="text-[11px] tracking-[0.18em] text-muted uppercase">{d.label}</dt>
                  <dd className="mt-1.5 text-sm">
                    {d.href ? (
                      <a href={d.href} className="transition-colors duration-300 hover:text-brand">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="card p-6 sm:p-10"
          >
            {state?.ok ? (
              <div className="flex min-h-80 flex-col items-start justify-center" role="status">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-brand/50 text-brand">
                  ✓
                </span>
                <h3 className="mt-6 font-display text-3xl tracking-tight">Message received.</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} noValidate className="grid gap-7 sm:grid-cols-2">
                {/* Honeypot — hidden from people, tempting to bots */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                </div>

                <Field label="Full name *" name="name" error={errors.name}>
                  <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={inputClass} {...aria("name")} />
                </Field>

                <Field label="Email *" name="email" error={errors.email}>
                  <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputClass} {...aria("email")} />
                </Field>

                <Field label="Phone" name="phone">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass} />
                </Field>

                <Field label="Company" name="company">
                  <input id="company" name="company" autoComplete="organization" defaultValue={v.company} className={inputClass} />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="I'm interested in" name="service">
                    <select id="service" name="service" defaultValue={v.service ?? ""} className={`${inputClass} cursor-pointer [&>option]:bg-card`}>
                      <option value="">Not sure yet</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="How can we help? *" name="message" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      defaultValue={v.message}
                      className={`${inputClass} resize-none`}
                      {...aria("message")}
                    />
                  </Field>
                </div>

                <div className="flex flex-col-reverse gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted" aria-live="polite">
                    {state?.message ?? "We'll only use your details to reply to this enquiry."}
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    className="shrink-0 rounded-full bg-logo-blue px-8 py-3.5 text-sm font-medium text-white transition-[filter,opacity] duration-300 hover:brightness-115 disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send enquiry"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
