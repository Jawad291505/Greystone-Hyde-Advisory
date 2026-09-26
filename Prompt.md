I want you to rethink and redesign the existing website into a **world-class premium London accounting and financial services SPA**.

This is NOT a request to simply add more animations.

The goal is to create a website that feels like a serious, high-end financial brand where **design, storytelling, trust, services, and motion all work together**.

Use the existing Next.js project and existing brand assets as the foundation, but you have permission to substantially restructure the current page if necessary.

---

# CORE IDEA

The website should communicate one simple idea:

**Accounting should turn financial complexity into clarity.**

The experience should progress naturally:

**Trust → Complexity → Organization → Services → Value → Modern Finance → Action**

Do not put every visual idea into the hero.

Each major animation should explain a different business concept.

---

# 1. INSPECT THE EXISTING PROJECT FIRST

Before changing anything:

* Inspect the existing Next.js structure.
* Inspect App Router/Pages Router.
* Inspect Tailwind and existing styling.
* Inspect existing components.
* Inspect dependencies.
* Inspect `/public/logo.svg`.
* Extract the actual colors from the logo.
* Reuse existing good components where appropriate.
* Identify what can be refactored instead of duplicated.

Do NOT convert the project to another framework.

Do NOT unnecessarily destroy existing functionality.

---

# 2. BRAND DIRECTION

The company is a **London-based accounting/financial services agency**.

The design should feel:

* Premium
* Intelligent
* Trustworthy
* Modern
* Financial
* Precise
* Confident
* Minimal
* Technologically advanced

Think:

**high-end London financial consultancy + modern fintech**

NOT:

* Generic accounting template
* Traditional boring accountant website
* Generic SaaS landing page
* Crypto/Web3
* Neon fintech
* Excessive glassmorphism
* AI-generated visual clutter

Use the existing logo as the source of truth.

Do NOT assume its colors.

Inspect `/public/logo.svg` and build the palette from the actual logo.

---

# 3. DARK VISUAL SYSTEM

Keep the entire website dark.

Use:

* Near-black/charcoal backgrounds
* Slightly lighter charcoal surfaces
* Actual logo colors as primary accents
* Off-white typography
* Muted gray secondary text
* Metallic gold only as a secondary accent

Do not make gold the main brand color.

Do not introduce random blue/purple/neon accents.

Use generous negative space.

The website should feel expensive because of **composition, typography, spacing, depth and restraint**, not because every section contains an effect.

---

# 4. HERO — KEEP IT CLEAN

The hero is NOT where all the animations belong.

It should be the cleanest section on the website.

Use an elegant composition:

### Left

A powerful headline about solving financial complexity.

Supporting copy explaining the accounting/financial service.

Primary CTA:

**Get Started**

Optional secondary CTA.

### Right

One premium visual/image.

This could be:

* A sophisticated financial abstract
* Architectural London-inspired visual
* Premium financial visualization
* Custom 3D object
* Editorial-style financial image

Do NOT put the Rubik's cube, dozens of cards, pound coins, invoices and floating financial objects all together here.

The first viewport should immediately communicate:

**“This is a serious premium financial company.”**

The hero can have subtle parallax/reveal animation, but it should remain calm.

---

# 5. SECTION — “FROM COMPLEXITY TO CLARITY”

This is the first major visual experience.

Introduce the problem:

Accounting can involve:

* invoices
* expenses
* tax
* payroll
* cash flow
* reporting
* transactions
* documents
* numbers

Initially, represent these as scattered, disconnected financial fragments.

Then use scroll-driven animation to progressively organize them.

---

# 6. RUBIK'S CUBE EXPERIENCE

The scattered financial information should gradually form a sophisticated **Rubik's-cube-inspired structure**.

This is the main metaphor:

**Financial complexity → structured system → clarity**

Use:

* Three.js / React Three Fiber if appropriate
* GSAP + ScrollTrigger
* Actual brand colors
* Dark materials
* Subtle financial labels

Possible cube labels:

TAX
VAT
PAYROLL
CASH FLOW
EXPENSES
INVOICES
REPORTING

Do not use traditional Rubik's cube colors.

Do not make it look like a toy.

Make it feel like a **premium architectural financial object**.

The cube can:

1. Begin fragmented
2. Organize itself
3. Form
4. Rotate subtly with scroll
5. Align perfectly
6. Resolve into a clean final state

Possible final message:

**Complexity, organized.**

This section should be visually impressive.

This is where the heavy ScrollTrigger animation belongs.

---

# 7. SERVICES — MAKE THE BUSINESS CLEAR

After the visual metaphor, clearly explain what the company actually does.

Create a premium services system for appropriate accounting services such as:

* Accounting
* Bookkeeping
* VAT
* Tax
* Payroll
* Financial Reporting
* Management Accounts
* Business Advisory
* Tax Planning

Do not blindly include services that are not appropriate to the existing company.

Inspect existing content first.

Present services in a sophisticated interactive layout rather than generic identical cards.

For example:

A large active service panel with smaller services surrounding it.

Hovering/selecting a service can change the main visual/content.

Keep it fast and elegant.

---

# 8. LONDON / GBP EXPERIENCE

Create a separate cinematic section around **GBP and financial value**.

This is where the golden pound coins belong.

Do NOT put a large number of coins into the hero.

Use a restrained number of premium metallic £ coins.

The visual language should communicate:

**Value → Movement → Growth → Financial control**

Coins can:

* Move through depth
* Rotate slowly
* Follow curved paths
* React to scrolling
* Pass behind/around typography
* Eventually settle into an organized composition

Do not make every coin constantly spin.

Use gold as a secondary premium accent against the dark environment and brand colors.

The London identity should remain subtle.

Do NOT use:

* Union Jack everywhere
* Crowns
* Flags
* Random London landmarks
* Generic British imagery

GBP itself is enough to establish the financial/UK context.

---

# 9. WHY US / TRUST

This section is extremely important.

Accounting is a trust-based service.

Do not make the website 90% visual animation and 10% actual business information.

Explain why a client should trust the company.

Use real available information for:

* Qualifications
* Certifications
* Experience
* Industries served
* Client types
* Genuine statistics
* Software/accounting platforms
* Team
* Process
* Testimonials

If information is unavailable, create clearly identifiable placeholders rather than inventing facts.

The section should visually feel quieter than the Rubik's cube and coin sections.

---

# 10. PROCESS

Create a simple premium process:

**01 — Understand**

Understand the business and financial situation.

**02 — Organize**

Bring financial information into order.

**03 — Advise**

Identify opportunities, risks and actions.

**04 — Support**

Provide ongoing accounting/financial support.

Use subtle scroll reveals rather than another massive 3D animation.

---

# 11. PAYMENT TECHNOLOGY — CREDIT CARD → PAYMENT LINK

Near the end of the website, create a dedicated interactive payment section.

This is where the existing credit-card animation belongs.

The purpose is to demonstrate modern payment convenience.

Show a premium financial card.

Then provide an interaction such as:

**Create Payment Link**

When triggered:

1. Card appears.
2. Card moves into focus.
3. Card information reorganizes.
4. The physical-card representation transforms.
5. It becomes a clean digital payment-link interface.
6. The final UI communicates a shareable payment experience.

This should feel like a sophisticated product demonstration.

Stripe Payment Links are fundamentally based around creating and sharing a payment link, so use that conceptual flow rather than inventing a complicated payment interaction.

If using Stripe branding, do not imply an official partnership unless the company actually has one.

---

# 12. FINAL CTA

After the interactive sections, deliberately become quiet again.

Use large typography and plenty of space.

Possible direction:

**Your finances should create clarity, not complexity.**

Then:

**Let's talk.**

CTA:

**Get Started**

The ending should feel confident, not desperate.

---

# 13. PAGE RHYTHM

Do not make every section visually intense.

The rhythm should be:

**Quiet → Cinematic → Structured → Cinematic → Quiet → Interactive → Quiet**

Specifically:

Hero
↓
Intro
↓
Rubik's Cube
↓
Services
↓
GBP Coins
↓
Why Us / Trust
↓
Process
↓
Credit Card → Payment Link
↓
Final CTA

This is important.

Give the user's eyes time to rest between major visual experiences.

---

# 14. MOTION SYSTEM

Use GSAP + ScrollTrigger for meaningful scroll-driven sequences.

ScrollTrigger supports scrubbed progress, pinning and responsive scroll-triggered timelines, making it suitable for the dedicated visual sections rather than forcing the entire site into one animation.

Motion principles:

* Slow
* Cinematic
* Precise
* Physical
* Layered
* Intentional

Avoid:

* Constant spinning
* Random floating objects
* Excessive particles
* Excessive blur
* Bouncing UI
* Fast transitions
* Animation for animation's sake

Every major animation should communicate something.

---

# 15. RESPONSIVE DESIGN

Desktop can use the full visual experience.

On mobile:

* Simplify 3D
* Reduce object count
* Shorten animation sequences
* Preserve the concept
* Keep typography strong
* Maintain negative space
* Never allow animation to make the site difficult to navigate

If necessary, use simplified SVG/CSS versions instead of heavy 3D.

---

# 16. PERFORMANCE

Do not initialize every expensive visual at once.

Use:

* Lazy loading
* Efficient GSAP timelines
* GPU-friendly transforms
* Proper cleanup
* Responsive animation strategies
* Reduced-motion support
* Minimal unnecessary dependencies

The website should still feel fast despite the interactive experiences.

---

# 17. DEVELOPMENT APPROACH

Do not implement everything in one huge pass.

Build and inspect incrementally:

### Phase 1

Inspect existing project and brand.

### Phase 2

Refine global design system and clean hero.

### Phase 3

Build/refine Rubik's cube section.

### Phase 4

Build/refine services and trust sections.

### Phase 5

Build/refine GBP coin experience.

### Phase 6

Build/refine payment card → payment link experience.

### Phase 7

Final CTA, responsive behavior and transitions.

### Phase 8

Performance, accessibility and production QA.

After each major phase, run the site and visually inspect it before continuing.

---

# FINAL CREATIVE RULE

Do not try to impress the user by putting everything on screen immediately.

**The website should reveal its intelligence as the user scrolls.**

The hero earns attention.

The Rubik's cube explains complexity.

The services explain the business.

The GBP section establishes the London financial identity.

The trust section establishes credibility.

The payment interaction demonstrates modern technology.

The final CTA converts the experience into action.

The result should feel like a **premium London accounting agency that happens to have exceptional interactive design**, not an animation website pretending to be an accounting agency.
