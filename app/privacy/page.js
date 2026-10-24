import CookieSettingsButton from "../components/CookieSettingsButton";

export const metadata = {
  title: "Privacy, Cookies & Legal | Greystone Hyde Advisory",
  description:
    "How Greystone Hyde Advisory collects, uses and protects your personal data, the cookies this website uses, and the terms that apply to using it.",
};

const CONTAINER = "mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12";
const UPDATED = "20 October 2026";
const EMAIL = "info@greystonehyde.co.uk";

const rise = (delay) => ({ "data-intro": "", style: { "--d": `${delay}s`, "--rise": "20px" } });

const SECTIONS = [
  { id: "who-we-are", title: "Who we are" },
  { id: "privacy", title: "Privacy notice" },
  { id: "cookies", title: "Cookie policy" },
  { id: "terms", title: "Website terms of use" },
  { id: "payments", title: "Paying an invoice online" },
  { id: "complaints", title: "Complaints about our service" },
  { id: "contact", title: "Contact us" },
];

const num = (i) => String(i + 1).padStart(2, "0");
const inline = "text-royal underline decoration-royal/30 underline-offset-4 transition-colors hover:decoration-royal";

const Email = () => (
  <a href={`mailto:${EMAIL}`} className={inline}>
    {EMAIL}
  </a>
);

function External({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={inline}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// One numbered part of the page, under its own rule
function Section({ index, children }) {
  const { id, title } = SECTIONS[index];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-navy/10 pt-10 lg:pt-12">
      <p className="font-mono text-[11px] tracking-[0.2em] text-royal">{num(index)}</p>
      <h2 id={`${id}-title`} className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.05] tracking-[-0.015em]">
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

const H3 = ({ children }) => <h3 className="pt-4 font-display text-[1.45rem] leading-[1.15] tracking-tight">{children}</h3>;
const P = ({ children }) => <p className="max-w-[44rem]">{children}</p>;

function List({ children }) {
  return <ul className="max-w-[44rem] space-y-2.5 pl-5 marker:text-royal [&>li]:list-disc [&>li]:pl-1">{children}</ul>;
}

// A row of "what / why / basis" for one way we collect data
function Use({ when, what, why, basis }) {
  return (
    <div className="max-w-[44rem] rounded-card border border-navy/10 bg-sky/60 p-5 sm:p-6">
      <p className="font-medium text-ink">{when}</p>
      <dl className="mt-4 grid gap-4 text-[15px] sm:grid-cols-[9rem_1fr] sm:gap-x-6">
        <dt className="font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase sm:pt-1">What we collect</dt>
        <dd>{what}</dd>
        <dt className="font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase sm:pt-1">Why we use it</dt>
        <dd>{why}</dd>
        <dt className="font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase sm:pt-1">Our legal basis</dt>
        <dd>{basis}</dd>
      </dl>
    </div>
  );
}

// Legal, privacy and cookie information on one page: a short heading, a
// contents list that stays in view on wide screens, and the policy itself in
// seven numbered parts. Server-rendered; the only client code is the button
// that re-opens the cookie banner.
export default function PrivacyPage() {
  return (
    <main className="bg-paper text-ink">
      <section aria-labelledby="privacy-title" className="relative overflow-x-clip bg-[radial-gradient(60%_60%_at_15%_20%,var(--sky),transparent_72%)]">
        <div className={`${CONTAINER} pt-32 pb-12 sm:pt-36 lg:pt-44 lg:pb-16`}>
          <p {...rise(0)} className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.2em] text-navy/70 uppercase">
            <span className="h-px w-8 bg-royal" />
            Legal
            <span aria-hidden className="text-navy/30">/</span>
            <span className="text-navy/55">Last updated {UPDATED}</span>
          </p>
          <h1
            {...rise(0.1)}
            id="privacy-title"
            className="mt-7 max-w-4xl font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.02] tracking-[-0.015em] text-balance"
          >
            Legal, privacy and <em className="text-royal">cookie information.</em>
          </h1>
          <p {...rise(0.22)} className="mt-8 max-w-[38rem] text-[17px] leading-[1.7] text-navy/85 sm:text-lg">
            What personal data we collect, why, who sees it and how long we keep it; the cookies this
            site uses; and the terms that apply when you use it.
          </p>
        </div>
      </section>

      <div className={`${CONTAINER} grid gap-10 pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-28`}>
        {/* Contents */}
        <nav aria-label="On this page" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[10px] tracking-[0.2em] text-navy/55 uppercase">On this page</p>
            <ol className="mt-4 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group flex items-baseline gap-3 py-2 text-[15px] text-navy/75 transition-colors hover:text-royal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                  >
                    <span className="font-mono text-[11px] text-navy/40 group-hover:text-royal">{num(i)}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <CookieSettingsButton className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-navy/20 px-5 text-sm font-medium text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal">
              Change cookie settings
            </CookieSettingsButton>
          </div>
        </nav>

        <article className="space-y-14 text-[16px] leading-[1.75] text-navy/85 lg:col-span-8 lg:col-start-5">
          <Section index={0}>
            <P>
              This website is operated by Greystone Hyde Advisory Ltd., trading as Greystone Hyde. We
              are a company registered in England and Wales with company number 15520640. In this page,
              “we”, “us” and “our” mean that company.
            </P>
            <List>
              <li>
                <strong className="font-medium text-ink">Registered office:</strong> 4–6 Greatorex St, E1
                5NF. This is the address Companies House holds for us and where formal legal notices can
                be sent.
              </li>
              <li>
                <strong className="font-medium text-ink">Trading address:</strong> Suite C220, 4-6
                Greatorex Street, London, England, E1 5NF, which is where we meet clients by appointment
                during our opening hours of Monday to Friday, 9:00 to 17:30.
              </li>
              <li>
                <strong className="font-medium text-ink">Email:</strong> <Email />. This is the address to
                use for any enquiry, complaint or request about your personal data.
              </li>
            </List>
          </Section>

          <Section index={1}>
            <P>
              This notice explains what personal data we collect when you use this website or work with
              us, why we collect it, who sees it, how long we keep it, and what rights you have over it.
            </P>

            <H3>2.1 Who is responsible for your personal data</H3>
            <P>
              We are the data controller for the personal data described in this notice. The one
              exception is payroll and similar services: when we process your employees’ data on your
              behalf, you are the controller, we act as your processor, and the terms are set out in our
              engagement letter.
            </P>

            <H3>2.2 What we collect, why, and our legal basis</H3>
            <P>
              We only collect personal data we have a clear reason to use. Under the UK GDPR we must have
              a lawful basis for each use, and these are ours.
            </P>
            <Use
              when="When you send us an enquiry through the website form, email, phone or WhatsApp"
              what="Your name, email address, phone number, company name, the service you are interested in, and whatever you tell us in your message."
              why="To reply to you, understand what you need, prepare a quote and arrange a consultation."
              basis="Legitimate interests, because we cannot run an accounting practice without answering enquiries, and taking steps at your request before entering a contract."
            />
            <Use
              when="When you become a client"
              what="Identity and contact details, details of your company and its owners and directors, the financial records, bank information and tax details you give us so that we can do the work, and the bank details we need to collect our fees."
              why="To prepare accounts, returns and filings, run payroll, give advice, and invoice you."
              basis="Performing our contract with you, and complying with legal obligations such as tax and company law filing requirements."
            />
            <Use
              when="When we carry out client due diligence"
              what="Copies of identity documents, proof of address, information about who owns and controls the business, and, where needed, information about where funds come from."
              why="Accountancy firms must verify who they act for and monitor for money laundering. We cannot take you on as a client without completing these checks."
              basis="Legal obligation under the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017."
            />
            <Use
              when="When you pay an invoice online"
              what="Payments are handled by Stripe. We see the payment status, amount and invoice reference. We never see or store your full card number."
              why="To take payment and reconcile it against your invoice."
              basis="Performing our contract with you, and legitimate interests in being paid correctly."
            />
            <Use
              when="When you visit the website"
              what={
                <>
                  Technical information such as your IP address, browser type, device and the pages you
                  view. Some of this is collected through cookies, explained in{" "}
                  <a href="#cookies" className={inline}>
                    section 3
                  </a>
                  .
                </>
              }
              why="To keep the site secure and working, and, only if you consent, to understand how visitors use it so we can improve it."
              basis="Legitimate interests for security and essential site operation, and your consent for any non-essential cookies."
            />
            <P>
              We do not make decisions about you using automated processing or profiling that has legal
              or similarly significant effects. We do not intentionally collect sensitive categories of
              data through the website, so please do not include health, political or similar details in
              the contact form.
            </P>

            <H3>2.3 Where we get your data from</H3>
            <P>
              Most of the data comes directly from you. We also receive information from other sources
              where it is needed to do the work:
            </P>
            <List>
              <li>Your previous accountant, once you have authorised us to contact them, so that we can take over your records without gaps.</li>
              <li>HMRC and Companies House, through the online services we use to file and check your position on your behalf.</li>
              <li>Your accounting, payroll or banking software, where you give us access so that we can work in your live records.</li>
              <li>Identity-verification and company-search providers, which we use to complete due diligence checks.</li>
            </List>

            <H3>2.4 Who we share your data with</H3>
            <P>
              We share your data only where it is necessary to do the work or the law requires it, and
              always on appropriate terms. We never sell your data.
            </P>
            <List>
              <li>Government bodies and regulators, such as HMRC, Companies House and The Pensions Regulator, where a filing or the law requires us to provide information.</li>
              <li>Software providers, such as Xero, QuickBooks, Sage and FreeAgent, which hold your accounting and payroll records on our behalf or yours.</li>
              <li>Our website host and email provider, which process enquiries and messages that pass through our systems.</li>
              <li>Stripe, which processes online card payments.</li>
              <li>Professional advisers, insurers and our anti-money-laundering supervisory body, who may need to see records in order to advise us, handle a claim or carry out a supervisory review.</li>
              <li>A successor to our business, if we were ever to merge with or be acquired by another firm. Your data would stay protected on the same terms.</li>
            </List>

            <H3>2.5 International transfers</H3>
            <P>
              Some of our suppliers, such as cloud software and hosting providers, and team members or
              subcontractors may process personal data outside the United Kingdom.
            </P>
            <P>
              Where personal data goes to a country that does not have a UK adequacy decision, we put a
              recognised safeguard in place first. This is normally the Information Commissioner’s
              International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual
              Clauses, together with an assessment of the risks of the transfer. You can ask us for details
              of the safeguards that apply to your data by emailing <Email />.
            </P>

            <H3>2.6 How long we keep your data</H3>
            <P>
              We keep personal data only for as long as we need it for the purpose it was collected, and
              for as long as the law or our professional obligations require. After that we delete it
              securely or anonymise it.
            </P>
            <List>
              <li><strong className="font-medium text-ink">Enquiries that do not lead to an engagement:</strong> kept for 12 months so that we can follow up on your enquiry and answer any later questions, then deleted.</li>
              <li><strong className="font-medium text-ink">Identity and due diligence records:</strong> kept for at least five years after our business relationship with you ends, as the Money Laundering Regulations require.</li>
              <li><strong className="font-medium text-ink">Client accounting, tax and advisory files:</strong> kept for six years after the engagement ends. This covers HMRC enquiry periods and the time limit for legal claims.</li>
              <li><strong className="font-medium text-ink">Payroll records:</strong> kept for six years after the end of the tax year they relate to, which is longer than HMRC’s minimum so that we can respond to any later query.</li>
              <li><strong className="font-medium text-ink">Marketing records:</strong> kept until you withdraw consent. We then keep only a minimal record of your email address so that we do not contact you again.</li>
            </List>

            <H3>2.7 How we keep your data secure</H3>
            <P>
              We protect your data with encrypted and access-controlled systems, multi-factor
              authentication and role-based access, so that only the people working on your account can
              see your information. Please do not send confidential financial documents by WhatsApp or
              ordinary email. When you become a client we will agree a secure way of exchanging documents
              with you.
            </P>

            <H3>2.8 Your rights</H3>
            <P>Under UK data protection law you have the following rights:</P>
            <List>
              <li><strong className="font-medium text-ink">Access:</strong> you can ask for a copy of the personal data we hold about you and for details of how we use it.</li>
              <li><strong className="font-medium text-ink">Correction:</strong> you can ask us to correct data that is inaccurate or incomplete.</li>
              <li><strong className="font-medium text-ink">Erasure:</strong> you can ask us to delete your data where we no longer need it. We may need to keep some records where the law requires it, for example due diligence and tax records.</li>
              <li><strong className="font-medium text-ink">Restriction:</strong> you can ask us to pause the use of your data while a concern about its accuracy or our use of it is resolved.</li>
              <li><strong className="font-medium text-ink">Portability:</strong> you can ask for the data you gave us in a structured, commonly used format, where we process it under a contract or with your consent.</li>
              <li><strong className="font-medium text-ink">Objection:</strong> you can object to us using your data on the basis of legitimate interests, and to any direct marketing at any time.</li>
              <li><strong className="font-medium text-ink">Withdrawing consent:</strong> where we rely on your consent, you can withdraw it at any time without affecting anything we did before.</li>
            </List>
            <P>
              To use any of these rights, email <Email />. We will respond within one month. We may need to
              confirm your identity first.
            </P>

            <H3>2.9 Complaints about how we use your data</H3>
            <P>
              Please contact us first so that we can try to put things right. You also have the right to
              complain to the Information Commissioner’s Office at{" "}
              <External href="https://ico.org.uk">ico.org.uk</External> or on{" "}
              <a href="tel:+443031231113" className={inline}>
                0303 123 1113
              </a>
              .
            </P>

            <H3>2.10 Changes to this notice</H3>
            <P>
              We may update this notice from time to time. The “last updated” date at the top of this page
              shows when it last changed.
            </P>
          </Section>

          <Section index={2}>
            <P>
              Cookies and similar technologies are small files or scripts stored on your device when you
              visit a website. Some are essential for the site to work, and others are optional. We only
              set optional cookies after you have accepted them in the cookie banner, and you can change
              your choice at any time.
            </P>
            <P>We use or may use the following types:</P>
            <List>
              <li>
                <strong className="font-medium text-ink">Embedded map cookies.</strong> The map on our
                contact section is provided by Google Maps, and Google may set its own cookies when it
                loads. The map loads only after you consent. Without it, you can still use the “Get
                directions” link to open Google Maps in a new tab.
              </li>
              <li>
                <strong className="font-medium text-ink">Payment cookies.</strong> If you click “Pay
                Securely”, you leave our site and Stripe’s checkout page may set its own cookies. These are
                governed by Stripe’s cookie and privacy policies.
              </li>
            </List>
            <div>
              <CookieSettingsButton className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-royal px-5 text-sm font-medium text-white transition-colors duration-300 hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal">
                Change cookie settings
              </CookieSettingsButton>
            </div>
          </Section>

          <Section index={3}>
            <P>By using this website you agree to the following terms.</P>
            <List>
              <li><strong className="font-medium text-ink">General information only.</strong> The content of this site is general information and is not accounting, tax, legal or financial advice. Please do not rely on it to make a decision about your own circumstances. Our services are governed by the engagement letter we agree with you, and that letter takes precedence over anything on this page.</li>
              <li><strong className="font-medium text-ink">No client relationship from an enquiry.</strong> Sending an enquiry or message does not make you a client. Please do not send confidential information until we have agreed an engagement with you.</li>
              <li><strong className="font-medium text-ink">Examples are illustrative.</strong> The figures shown in our service examples and dashboards are for illustration only. They are not a quote, forecast or guarantee of any result.</li>
              <li><strong className="font-medium text-ink">Prices.</strong> The prices on this site are starting points and exclude VAT unless stated. We confirm your fee in writing before any work begins, and one-off work is quoted separately.</li>
              <li><strong className="font-medium text-ink">Intellectual property.</strong> The content, design and logo on this site belong to us or our licensors. You may view and print pages for your own business use, but you may not copy or republish them for commercial purposes without our written permission. Third-party names and logos belong to their owners, and displaying them does not imply their endorsement.</li>
              <li><strong className="font-medium text-ink">Accuracy and availability.</strong> We take reasonable care to keep the site accurate and available, but we cannot guarantee that it will be free of errors or always accessible.</li>
              <li><strong className="font-medium text-ink">Links to other sites.</strong> We are not responsible for the content or privacy practices of any external website we link to.</li>
              <li><strong className="font-medium text-ink">Our liability.</strong> Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited. Subject to that, we are not liable for any loss arising from your use of, or reliance on, this website.</li>
              <li><strong className="font-medium text-ink">Governing law.</strong> These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you are a consumer, you may also have the right to bring proceedings in the courts of the part of the UK where you live.</li>
            </List>
          </Section>

          <Section index={4}>
            <P>
              Online payments are processed by Stripe Payments UK Ltd through a secure checkout page that
              opens in a new tab. We never see or store your full card details. Stripe acts as an
              independent controller of the payment data it collects, and you can read how it uses that
              data at <External href="https://stripe.com/gb/privacy">stripe.com/gb/privacy</External>. If
              you have a question about an invoice, please contact us before paying.
            </P>
          </Section>

          <Section index={5}>
            <P>
              If you are unhappy with any part of our service, please write to <Email />. We will
              acknowledge your complaint within five working days and aim to give you a full response
              within 30 days. If we cannot resolve it between us, you may be able to refer it to
              supervisory authority.
            </P>
          </Section>

          <Section index={6}>
            <P>
              Please contact us at Suite C220, 4-6 Greatorex Street, London, England, E1 5NF and <Email />
            </P>
          </Section>
        </article>
      </div>
    </main>
  );
}
