const NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || "info@nouvexeng.com";
const MAX_BODY_BYTES = 16_384;
const demoLeads = [];

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseBody(body) {
  if (typeof body === "string") return JSON.parse(body);
  if (body && typeof body === "object") return body;
  return {};
}

function isLocalDemo(request) {
  const address = request.socket && request.socket.remoteAddress;
  return process.env.NOUVEX_DEMO_MODE === "local-only"
    && ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
}

function validate(input) {
  const lead = {
    name: text(input.name, 160),
    company: text(input.company, 200),
    email: text(input.email, 254).toLowerCase(),
    phone: text(input.phone, 32),
    message: text(input.message, 2_000),
    sourceUrl: text(input.sourceUrl, 500)
  };

  const errors = [];
  if (!lead.name) errors.push("name");
  if (!lead.company) errors.push("company");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("email");
  const phoneDigits = lead.phone.replace(/\D/g, "").length;
  if (!/^[0-9+().\-\s]*$/.test(lead.phone) || phoneDigits < 7 || phoneDigits > 15) errors.push("phone");

  return { lead, errors };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailText(lead) {
  return [
    "NOUVEX ENGINEERING - NEW INQUIRY",
    "",
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    "",
    "Message:",
    lead.message || "Not provided",
    "",
    `Source: ${lead.sourceUrl || "Not provided"}`
  ].join("\n");
}

function emailRow(label, value) {
  return `
    <tr>
      <td style="width: 120px; padding: 8px 16px 8px 0; color: #687076; font-size: 13px; vertical-align: top;">${escapeHtml(label)}</td>
      <td style="padding: 8px 0; color: #17191a; font-size: 14px; font-weight: 600; vertical-align: top;">${escapeHtml(value || "Not provided")}</td>
    </tr>`;
}

function emailHtml(lead) {
  const rows = [
    emailRow("Name", lead.name),
    emailRow("Company", lead.company),
    emailRow("Email", lead.email),
    emailRow("Phone", lead.phone)
  ].join("");
  const message = lead.message
    ? `<tr>
              <td style="padding: 8px 32px 8px;">
                <h2 style="margin: 0 0 12px; color: #17191a; font-size: 16px;">Message</h2>
                <div style="padding: 16px; background: #f7f8f8; border-left: 3px solid #f0b323; color: #303436; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(lead.message)}</div>
              </td>
            </tr>`
    : "";

  return `<!doctype html>
<html lang="en">
  <body style="margin: 0; padding: 0; background: #f3f4f4; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f3f4f4;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; background: #ffffff; border: 1px solid #dfe2e2;">
            <tr>
              <td style="padding: 28px 32px 20px; border-bottom: 3px solid #f0b323;">
                <div style="color: #687076; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Nouvex Engineering</div>
                <h1 style="margin: 8px 0 0; color: #17191a; font-size: 24px; line-height: 1.3;">New inquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 32px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
              </td>
            </tr>
            ${message}
            <tr>
              <td style="padding: 16px 32px 28px; color: #687076; font-size: 12px; line-height: 1.5;">
                Reply to this email to contact ${escapeHtml(lead.name)} directly.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendNotification(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email is not configured");

  const subjectName = `${lead.company} - ${lead.name}`.replace(/[\r\n]+/g, " ");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [NOTIFICATION_EMAIL],
      reply_to: lead.email,
      subject: `New inquiry - ${subjectName}`,
      text: emailText(lead),
      html: emailHtml(lead)
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Email notification failed", response.status, JSON.stringify(result).slice(0, 500));
    throw new Error("Email notification failed");
  }
}

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method === "GET" && isLocalDemo(request)) {
    return response.status(200).json({ demo: true, leads: demoLeads });
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return response.status(413).json({ error: "Request too large" });
  }

  let input;
  try {
    input = parseBody(request.body);
  } catch {
    return response.status(400).json({ error: "Invalid JSON" });
  }

  // Quietly accept honeypot submissions so automated senders get no useful signal.
  if (text(input.website, 200)) {
    return response.status(201).json({ accepted: true });
  }

  const { lead, errors } = validate(input);
  if (errors.length) {
    return response.status(422).json({ error: "Please add your name, company, a valid work email, and a phone number.", fields: errors });
  }

  if (isLocalDemo(request)) {
    demoLeads.unshift({ ...lead, created_at: new Date().toISOString() });
    demoLeads.splice(50);
    console.log(`[demo] Captured inquiry from ${lead.email}`);
    return response.status(201).json({ accepted: true, demo: true });
  }

  // There is no database: the email is the only record, so a failed send must reach the visitor.
  try {
    await sendNotification(lead);
  } catch (error) {
    console.error(error.message);
    return response.status(503).json({ error: "We could not send the inquiry. Please try again." });
  }

  return response.status(201).json({ accepted: true });
};
