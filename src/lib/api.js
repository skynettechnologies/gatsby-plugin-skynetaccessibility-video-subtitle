import { resolveApiBase, resolveWebsiteUrl } from "../constants"

/**
 * Every endpoint below is reached directly from the visitor's browser, so the
 * API must send permissive CORS headers for your origin. A request that fails
 * with no status and no body in the network panel is a CORS rejection, not a
 * bug in this file.
 *
 * The endpoints accept `multipart/form-data` and are keyed on `website_url`
 * alone — no bearer token. `adon_token` from registration is only needed for
 * the hosted iframe dashboard, which this plugin does not use.
 */

class ApiError extends Error {
  constructor(message, { status, endpoint, body } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.endpoint = endpoint
    this.body = body
  }
}

async function request(base, endpoint, { method = "POST", fields } = {}) {
  const url = `${base}${endpoint}`
  const init = { method, headers: { Accept: "application/json" } }

  if (fields && method === "POST") {
    const form = new FormData()
    Object.keys(fields).forEach((key) => {
      const value = fields[key]
      if (value !== null && value !== undefined && value !== "") {
        form.append(key, value)
      }
    })
    init.body = form
  }

  let response
  try {
    response = await fetch(url, init)
  } catch (error) {
    throw new ApiError(
      `Could not reach ${endpoint}. This is usually a CORS restriction or a blocked request — check the Network panel.`,
      { endpoint }
    )
  }

  const text = await response.text()

  if (!response.ok) {
    throw new ApiError(
      `${endpoint} returned ${response.status}. ${text.slice(0, 200)}`,
      { status: response.status, endpoint, body: text }
    )
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      `${endpoint} returned ${contentType || "an unknown type"} instead of JSON. Starts with: ${text.slice(0, 120)}`,
      { status: response.status, endpoint, body: text }
    )
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new ApiError(
      `${endpoint} returned malformed JSON: ${text.slice(0, 120)}`,
      { status: response.status, endpoint, body: text }
    )
  }
}

/**
 * The API is inconsistent about where arrays live across endpoints — `Data`,
 * `data`, `videos`, `packages`, or a bare array. Rather than guess per call
 * site, look in every known place once.
 */
function pickArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== "object") return []

  const candidates = [payload, payload.data, payload.result]
  for (const source of candidates) {
    if (!source || typeof source !== "object") continue
    const lookIn = keys.concat(["Data", "data", "items", "records"])
    for (const key of lookIn) {
      if (Array.isArray(source[key])) return source[key]
    }
  }
  return []
}

function normalizeVideo(raw, index) {
  return {
    id: raw.id ?? raw.video_id ?? index,
    title: raw.video_title || raw.title || raw.name || "Untitled video",
    videoUrl: raw.video_url || raw.videoUrl || raw.embed_url || raw.url || "",
    durationSeconds: Number(raw.total_duration ?? raw.duration ?? 0) || 0,
    language: raw.language || raw.video_language || raw.lang || "Unknown",
    createdAt: raw.created_at || raw.createdAt || raw.date || "",
  }
}

function normalizePlan(raw, index) {
  return {
    id: raw.id ?? raw.package_id ?? index,
    name: raw.name || raw.package_name || raw.title || "Plan",
    minutes: Number(raw.total_minutes ?? raw.minutes ?? raw.pages ?? 0) || 0,
    monthlyPrice: Number(raw.monthly_price ?? raw.price_monthly ?? 0) || 0,
    yearlyPrice: Number(raw.price ?? raw.yearly_price ?? 0) || 0,
    interval: raw.interval || raw.billing_interval || "M",
    paymentLink: raw.payment_link || raw.autologin_link || null,
  }
}

/**
 * `siteUrl` is an optional override. With nothing passed, the domain is read
 * from `window.location.hostname`, so the plugin needs no configuration and can
 * never be pointed at the wrong account by a stale config value.
 *
 * Must be called from the browser — during SSR there is no hostname to read.
 */
export function createClient({ environment = "production", siteUrl } = {}) {
  const base = resolveApiBase(environment)
  const websiteUrl = resolveWebsiteUrl(siteUrl)

  if (!websiteUrl) {
    throw new Error(
      "No domain available. createClient must run in the browser, or be given an explicit siteUrl."
    )
  }

  return {
    websiteUrl,
    environment,
    base,

    /** Creates or resumes the account for this domain. */
    async register({ email, name, platform = "Gatsby", manageByPlatform } = {}) {
      const payload = await request(base, "video-subtitle/get-start", {
        fields: {
          website_url: websiteUrl,
          email,
          name,
          platform,
          manage_by_platform: manageByPlatform ? 1 : 0,
        },
      })
      return {
        adonToken: payload.adon_token || null,
        adonLink: payload.adon_link || null,
        raw: payload,
      }
    },

    /** Processed videos plus the quota attached to the active plan. */
    async getVideoDetails() {
      const payload = await request(base, "video-subtitle/details", {
        fields: { website_url: websiteUrl },
      })
      const videos = pickArray(payload, ["videos", "video_list"]).map(
        normalizeVideo
      )
      const activePackage = payload.adon_purchase_package || null

      return {
        videos,
        totalMinutes: Number(payload.total_minutes ?? 0) || 0,
        activePackage,
        activePackageId:
          (activePackage && activePackage.package_price_id) ?? null,
        raw: payload,
      }
    },

    /**
     * Documented as GET, but the reference implementation POSTs `website_url`
     * because that is what makes the response include per-plan autologin
     * payment links. Without them there is nothing to send the customer to.
     */
    async getPackages() {
      const payload = await request(base, "video-subtitle/packages", {
        fields: { website_url: websiteUrl },
      })
      return pickArray(payload, ["packages", "plans", "plan_packages"]).map(
        normalizePlan
      )
    },

    /** Maps language codes to display names. Shared across all customers. */
    async getActiveLanguages() {
      const payload = await request(base, "active-language", { method: "GET" })
      const list = pickArray(payload, ["languages"])
      const map = {}
      list.forEach((entry) => {
        if (entry && entry.code) {
          map[entry.code] = entry.original_name || entry.name || entry.code
        }
      })
      return map
    },

    async getSettings() {
      const payload = await request(base, "video-subtitle/settings", {
        fields: { website_url: websiteUrl },
      })
      return {
        followWidgetLanguage: Number(payload.video_widget_lang_enable ?? 1) !== 0,
        raw: payload,
      }
    },

    async updateSettings({ followWidgetLanguage }) {
      return request(base, "video-subtitle/update-settings", {
        fields: {
          website_url: websiteUrl,
          video_widget_lang_enable: followWidgetLanguage ? 1 : 0,
        },
      })
    },
  }
}

export { ApiError }
