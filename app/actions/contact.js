"use server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handles the homepage contact form. Validation runs here regardless of the
// client-side `required` attributes, since the action can be called directly.
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

  // TODO: deliver the enquiry (e.g. Resend/SMTP/CRM). Until then it's only
  // logged on the server.
  console.log("[contact] new enquiry", values);

  return { ok: true, message: "Thanks — we'll be in touch within one working day." };
}
