const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Enquiries are delivered by FormSubmit (formsubmit.co), so the site needs no
// backend of its own. The very first submission sends an activation email to
// this address; enquiries arrive once that link has been clicked.
const ENDPOINT = "https://formsubmit.co/ajax/info@greystonehyde.co.uk";

// Handles the homepage contact form in the browser, as a useActionState action.
export async function sendEnquiry(prevState, formData) {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company_website")) {
    return { ok: true, message: "Thanks — we'll be in touch shortly." };
  }

  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    service: String(formData.get("service") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  const errors = {};
  if (!values.name) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 10) errors.message = "Please tell us a little more (10+ characters).";
  if (values.message.length > 5000) errors.message = "Please keep your message under 5,000 characters.";

  if (Object.keys(errors).length) {
    return { ok: false, errors, values, message: "Please check the highlighted fields." };
  }

  const failed = {
    ok: false,
    values,
    message: "Sorry, your message couldn't be sent. Please try again or email info@greystonehyde.co.uk.",
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Name: values.name,
        Email: values.email,
        Phone: values.phone || "—",
        Company: values.company || "—",
        Service: values.service || "Not sure yet",
        Message: values.message,
        _subject: `New enquiry from ${values.name}`,
        _replyto: values.email,
        _template: "table",
        _captcha: "false",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== "true") return failed;
  } catch {
    return failed;
  }

  return { ok: true, message: "Thanks — we'll be in touch within one working day." };
}
