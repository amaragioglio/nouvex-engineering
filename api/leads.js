const NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || "info@nouvexeng.com";
const MAX_BODY_BYTES = 16_384;
const demoLeads = [];

const allowedRoutes = new Map([
  ["equipment", "01 / Design - Mechanical design and CAD"],
  ["analysis", "02 / Analysis - Simulation and analysis"],
  ["prototyping", "03 / Prototype - Prototypes and fixtures"],
  ["strategy", "04 / Diagnosis - Failure analysis"]
]);
const allowedTimelines = new Set(["Exploratory", "Active project", "Urgent - line down"]);

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
    reference: text(input.reference, 32),
    route_key: text(input.challenge, 32),
    route_label: "",
    focus: text(input.focus, 160),
    industry: text(input.industry, 120),
    timeline: text(input.timeline, 64),
    problem_description: text(input.description, 4_000),
    contact_name: text(input.name, 160),
    company: text(input.company, 200),
    work_email: text(input.email, 254).toLowerCase(),
    source_url: text(input.sourceUrl, 500)
  };

  const errors = [];
  if (!/^NVX-\d{8}-[A-Z0-9]{4}$/.test(lead.reference)) errors.push("reference");
  if (!allowedRoutes.has(lead.route_key)) {
    errors.push("challenge");
  } else {
    lead.route_label = allowedRoutes.get(lead.route_key);
  }
  if (!lead.focus) errors.push("focus");
  if (!lead.industry) errors.push("industry");
  if (!allowedTimelines.has(lead.timeline)) errors.push("timeline");
  if (lead.problem_description.length < 4) errors.push("description");
  if (!lead.contact_name) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.work_email)) errors.push("email");

  return { lead, errors };
}

function supabaseHeaders(secret) {
  const headers = {
    apikey: secret,
    "Content-Type": "application/json",
    Prefer: "resolution=ignore-duplicates,return=minimal"
  };

  // Legacy service_role keys are JWTs. Modern sb_secret keys authenticate via apikey.
  if (!secret.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${secret}`;
  }

  return headers;
}

async function insertLead(lead, request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecret) throw new Error("Supabase is not configured");

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/project_leads`, {
    method: "POST",
    headers: supabaseHeaders(supabaseSecret),
    body: JSON.stringify({
      ...lead,
      notification_status: "pending",
      user_agent: text(request.headers["user-agent"], 500)
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase insert failed", response.status, detail.slice(0, 500));
    throw new Error("Lead storage failed");
  }
}

async function updateNotification(reference, status, providerId = null) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/project_leads?reference=eq.${encodeURIComponent(reference)}`,
      {
        method: "PATCH",
        headers: supabaseHeaders(supabaseSecret),
        body: JSON.stringify({
          notification_status: status,
          notification_provider_id: providerId
        })
      }
    );

    if (!response.ok) console.error("Notification status update failed", response.status);
  } catch (error) {
    console.error("Notification status update failed", error.message);
  }
}

function emailText(lead) {
  return [
    "NOUVEX ENGINEERING - NEW PROJECT INQUIRY",
    `Reference: ${lead.reference}`,
    "",
    `Route: ${lead.route_label}`,
    `Focus: ${lead.focus}`,
    `Industry: ${lead.industry}`,
    `Timeline: ${lead.timeline}`,
    "",
    "Problem description:",
    lead.problem_description,
    "",
    `Contact: ${lead.contact_name}`,
    `Company: ${lead.company || "Not provided"}`,
    `Email: ${lead.work_email}`,
    `Source: ${lead.source_url || "Not provided"}`
  ].join("\n");
}

async function sendNotification(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email is not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [NOTIFICATION_EMAIL],
      reply_to: lead.work_email,
      subject: `[${lead.reference}] ${lead.route_label} - ${lead.company || lead.contact_name}`,
      text: emailText(lead)
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Email notification failed", response.status, JSON.stringify(result).slice(0, 500));
    throw new Error("Email notification failed");
  }

  return result.id || null;
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
    return response.status(201).json({ accepted: true, reference: text(input.reference, 32) });
  }

  const { lead, errors } = validate(input);
  if (errors.length) {
    return response.status(422).json({ error: "Please review the project details", fields: errors });
  }

  if (isLocalDemo(request)) {
    demoLeads.unshift({ ...lead, notification_status: "demo", created_at: new Date().toISOString() });
    demoLeads.splice(50);
    console.log(`[demo] Captured ${lead.reference} from ${lead.work_email}`);
    return response.status(201).json({
      accepted: true,
      reference: lead.reference,
      notificationSent: true,
      demo: true
    });
  }

  try {
    await insertLead(lead, request);
  } catch (error) {
    console.error(error.message);
    return response.status(503).json({ error: "We could not save the inquiry. Please try again." });
  }

  let notificationSent = false;
  let providerId = null;
  try {
    providerId = await sendNotification(lead);
    notificationSent = true;
  } catch (error) {
    console.error(error.message);
  }
  await updateNotification(lead.reference, notificationSent ? "sent" : "failed", providerId);

  return response.status(201).json({
    accepted: true,
    reference: lead.reference,
    notificationSent
  });
};
