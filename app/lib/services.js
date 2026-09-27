// The nine services, shared by the homepage drum and the /services page.
// Draft copy and illustrative figures — replace with the firm's real wording.
export const SERVICES = [
  {
    name: "Accounting",
    slug: "accounting",
    desc: "Year-end accounts and statutory filings, prepared accurately and on time.",
    points: ["Annual accounts & filings", "Companies House and HMRC submissions", "A named accountant who knows your business"],
    visual: { type: "bars", title: "Profit & loss", rows: [["Revenue", 92, "£482k"], ["Costs", 58, "£301k"], ["Profit", 34, "£181k"]] },
  },
  {
    name: "Bookkeeping",
    slug: "bookkeeping",
    desc: "Clean, reconciled books kept up to date, so you always know where you stand.",
    points: ["Bank and card reconciliation", "Invoice and expense processing", "Cloud accounting set-up and support"],
    visual: { type: "rows", title: "Bank feed", rows: [["Client receipt", "£3,420", "✓"], ["Office rent", "−£1,800", "✓"], ["Supplier invoice 118", "−£640", "✓"], ["Unmatched payment", "£210", "·"]] },
  },
  {
    name: "VAT",
    slug: "vat",
    desc: "Registration, returns and Making Tax Digital compliance handled end to end.",
    points: ["Registration and scheme advice", "Quarterly MTD-compliant returns", "HMRC enquiry support"],
    visual: { type: "rows", title: "VAT return", tag: "Filed", rows: [["Box 1 · VAT due on sales", "£18,240"], ["Box 4 · VAT reclaimed", "£6,905"], ["Box 5 · Net VAT due", "£11,335"]] },
  },
  {
    name: "Tax",
    slug: "tax",
    desc: "Corporation tax, self assessment and personal tax, prepared and filed correctly.",
    points: ["Corporation tax returns", "Self assessment for directors and owners", "Reliefs and allowances claimed in full"],
    visual: { type: "rows", title: "Tax computation", rows: [["Taxable profit", "£120,000"], ["Reliefs & allowances", "−£14,500"], ["Provision", "Calculated"]] },
  },
  {
    name: "Payroll",
    slug: "payroll",
    desc: "Reliable payroll and pensions, with RTI submissions and payslips handled for you.",
    points: ["Payslips and RTI submissions", "Auto-enrolment pensions", "P11D and year-end reporting"],
    visual: { type: "rows", title: "Payslip", tag: "Processed", rows: [["Gross pay", "£4,200.00"], ["PAYE tax", "−£620.40"], ["Employee NI", "−£287.20"], ["Net pay", "£3,292.40"]] },
  },
  {
    name: "Financial Reporting",
    slug: "financial-reporting",
    desc: "Clear, decision-ready reports that turn the numbers into a story.",
    points: ["Monthly and quarterly packs", "Board-ready formats", "Budgets against actuals"],
    visual: { type: "chart", title: "Revenue trend" },
  },
  {
    name: "Management Accounts",
    slug: "management-accounts",
    desc: "Timely management information: margins, cash and KPIs in a single view.",
    points: ["KPI dashboards", "Cash-flow forecasts", "Monthly review call"],
    visual: { type: "tiles", title: "This month", tiles: [["Gross margin", "41%", "+2.1"], ["Cash", "£284k", "+6%"], ["Debtor days", "32", "−4"], ["Runway", "14 mo", "="]] },
  },
  {
    name: "Business Advisory",
    slug: "business-advisory",
    desc: "Independent, practical advice on growth, funding and change.",
    points: ["Growth and funding planning", "Scenario modelling", "An ongoing sounding board"],
    visual: { type: "bars", title: "Scenarios", rows: [["A · Hold", 48, "Lower risk"], ["B · Expand", 72, "Higher return"], ["C · Restructure", 60, "Balanced"]] },
  },
  {
    name: "Tax Planning",
    slug: "tax-planning",
    desc: "Structured, compliant planning to keep your tax bill as efficient as the law allows.",
    points: ["Year-round planning, not year-end panic", "Reliefs, allowances and incentives", "Owner remuneration strategy"],
    visual: { type: "rows", title: "Planning calendar", rows: [["Q1", "Review structure"], ["Q2", "Plan pension & dividends"], ["Q3", "Model year-end position"], ["Q4", "Confirm & implement"]] },
  },
];
