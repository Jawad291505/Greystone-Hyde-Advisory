"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { sendEnquiry } from "../actions/contact";
import { SERVICES } from "../lib/services";

// Placeholder contact details — replace with the firm's real ones.
const details = [
  { label: "Email", value: "hello@greystonehyde.co.uk", href: "mailto:hello@greystonehyde.co.uk" },
  { label: "Phone", value: "+44 (0)20 0000 0000", href: "tel:+442000000000" },
  { label: "Office", value: "4–6 Greatorex St, London E1 5NF" },
  { label: "Hours", value: "Mon – Fri, 9:00 – 17:30" },
];

const ease = [0.22, 1, 0.36, 1];

const inputClass =
  "mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-navy/35 transition-[border-color,box-shadow] duration-300 outline-none focus:border-royal focus:shadow-[0_0_0_3px_rgba(36,82,181,0.12)] aria-[invalid=true]:border-red-600/70";

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-[10px] tracking-[0.18em] text-navy/60 uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-red-700">
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
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex items-center justify-between border-t border-navy/10 pt-5 font-mono text-[10px] tracking-[0.2em] text-navy/50 uppercase">
          <span>07 — Contact us</span>
          <span className="hidden sm:inline">Book a consultation</span>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2
              id="contact-title"
              className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.015em]"
            >
              Let&apos;s bring clarity <em className="text-royal">to your finances.</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-navy/75">
              Tell us a little about your business and what you need. A
              qualified accountant will reply within one working day — no
              obligation, no sales script.
            </p>

            <dl className="mt-10 grid border-t border-navy/10 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label} className="border-b border-navy/10 py-4 sm:odd:pr-6">
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-navy/50 uppercase">{d.label}</dt>
                  <dd className="mt-1.5 text-[15px] text-ink">
                    {d.href ? (
                      <a href={d.href} className="transition-colors duration-300 hover:text-royal">
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
            className="rounded-panel border border-navy/10 bg-white/60 p-6 sm:p-10 lg:col-span-7"
          >
            {state?.ok ? (
              <div className="flex min-h-80 flex-col items-start justify-center" role="status">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-royal/40 text-royal">
                  ✓
                </span>
                <h3 className="mt-6 font-display text-3xl tracking-tight">Message received.</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/70">{state.message}</p>
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
                    <select id="service" name="service" defaultValue={v.service ?? ""} className={`${inputClass} cursor-pointer`}>
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
                  <p className="text-xs text-navy/55" aria-live="polite">
                    {state?.message ?? "We'll only use your details to reply to this enquiry."}
                  </p>
                  <button
                    type="submit"
                    disabled={pending}
                    className="shrink-0 rounded-full bg-navy px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_18px_40px_-18px_rgba(20,42,92,0.6)] transition-[background-color,opacity] duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal disabled:opacity-60"
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
