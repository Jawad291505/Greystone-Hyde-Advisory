"use client";

import { useActionState } from "react";
import { sendEnquiry } from "../actions/contact";
import { SERVICES } from "../lib/services";

// The same details as the footer's. Both numbers open a WhatsApp chat (wa.me
// takes the full international number, digits only), not a phone call. `tip`
// is the note shown while a link is pointed at or focused, as on the header's
// number.
const details = [
  {
    label: "Email",
    below: true,
    tip: "Email us and a qualified accountant will reply within one working day.",
    items: [{ value: "info@greystonehyde.co.uk", href: "mailto:info@greystonehyde.co.uk" }],
  },
  {
    label: "WhatsApp",
    tip: "Message us on WhatsApp to arrange your free consultation.",
    items: [
      { value: "+44 7453 592896", href: "https://wa.me/447453592896", external: true },
      { value: "+44 7424 395949", href: "https://wa.me/447424395949", external: true },
    ],
  },
  { label: "Office", items: [{ value: "Suite C220, 4–6 Greatorex Street, London, England, E1 5NF" }] },
  { label: "Hours", items: [{ value: "Mon – Fri, 9:00 – 17:30" }] },
];

const inputClass =
  "mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-base text-ink placeholder:text-navy/35 transition-[border-color,box-shadow] duration-300 outline-none focus:border-royal focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--royal)_12%,transparent)] aria-[invalid=true]:border-red-600/70";

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
          <span>08 — Contact us</span>
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
                  {d.items.map((item, i) => (
                    <dd key={item.value} className="mt-1.5 text-[15px] text-ink tabular-nums">
                      {item.href ? (
                        <a
                          href={item.href}
                          aria-describedby={`contact-tip-${d.label}-${i}`}
                          {...(item.external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                            "aria-label": `Message us on WhatsApp: ${item.value}`,
                          })}
                          className="group relative inline-block transition-colors duration-300 hover:text-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal"
                        >
                          {item.value}
                          {/* The numbers' notes open above, so one never covers the
                              number below it; the email's opens below */}
                          <span
                            id={`contact-tip-${d.label}-${i}`}
                            role="tooltip"
                            className={`${d.below ? "top-full mt-3 translate-y-1" : "bottom-full mb-3 -translate-y-1"} pointer-events-none invisible absolute left-0 z-10 w-60 rounded-inner bg-navy px-4 py-3 text-[13px] leading-snug font-normal tracking-normal whitespace-normal text-white opacity-0 shadow-[0_22px_44px_-22px_color-mix(in_srgb,var(--ink)_70%,transparent)] transition-[opacity,translate,visibility] duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100`}
                          >
                            <span aria-hidden className={`${d.below ? "-top-1" : "-bottom-1"} absolute left-6 h-2.5 w-2.5 rotate-45 bg-navy`} />
                            {d.tip}
                          </span>
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>

          <div
            data-rise=""
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
                    className="shrink-0 rounded-full bg-navy px-8 py-3.5 text-sm font-medium tracking-wide text-white shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--navy)_60%,transparent)] transition-[background-color,opacity] duration-500 hover:bg-royal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Send enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
