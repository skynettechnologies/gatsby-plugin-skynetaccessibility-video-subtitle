/**
 * Shared between gatsby-node.js (build time) and the settings page (browser).
 * Dependency-free CommonJS so Node can require it directly.
 */

const API_HOSTS = {
  production: "https://ada.skynettechnologies.us/api/",
  staging: "https://stagingada.skynettechnologies.us/api/",
}

const WIDGET_SRC = {
  production:
    "https://www.skynettechnologies.com/accessibility/js/video-subtitle/video-subtitle-widget.js",
  staging:
    "https://devada.skynettechnologies.com/accessibility/js/video-subtitle/video-subtitle-widget.js",
}

const SCRIPT_ID = "aioa-adavs"

/**
 * Every option is optional. Listing the plugin as a bare string is a complete
 * configuration — the account is keyed on the domain the page is actually
 * served from, read at runtime.
 */
const DEFAULTS = {
  environment: "production",
  siteUrl: null,
  email: null,
  name: null,
  manageByPlatform: false,
  register: true,
  placement: "body",
  loadDelay: 0,
  reinjectOnRouteChange: false,
  settingsPage: true,
  settingsPath: "/skynetaccessibility-video-subtitle",
  widgetSrc: null,
}

/**
 * The API keys accounts by bare hostname — its own examples are values like
 * `happyscribe.com`. A protocol, `www.` prefix, port, or trailing slash makes
 * it a different string, which returns no data rather than an error.
 * Normalizing here is what makes reading the domain from the browser safe.
 */
function normalizeWebsiteUrl(input) {
  if (!input || typeof input !== "string") return ""
  let value = input.trim()
  if (!value) return ""

  value = value.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, "")
  value = value.split("/")[0]
  value = value.split("?")[0]
  value = value.split("#")[0]
  value = value.replace(/:\d+$/, "")
  value = value.replace(/^www\./i, "")

  return value.toLowerCase()
}

/**
 * Resolves the domain to operate on, in priority order:
 *
 *   1. An explicit `siteUrl` plugin option, when set.
 *   2. `window.location.hostname` — the domain the page is really served from.
 *
 * Returns an empty string during server-side rendering, so callers must resolve
 * this inside an effect rather than during render.
 */
function resolveWebsiteUrl(override) {
  if (override) return normalizeWebsiteUrl(override)
  if (typeof window === "undefined") return ""
  return normalizeWebsiteUrl(window.location.hostname)
}

function resolveApiBase(environment) {
  return API_HOSTS[environment] || API_HOSTS.production
}

function resolveWidgetSrc(options) {
  const opts = options || {}
  if (opts.widgetSrc) return opts.widgetSrc
  return WIDGET_SRC[opts.environment || "production"] || WIDGET_SRC.production
}

module.exports = {
  API_HOSTS,
  WIDGET_SRC,
  SCRIPT_ID,
  DEFAULTS,
  normalizeWebsiteUrl,
  resolveWebsiteUrl,
  resolveApiBase,
  resolveWidgetSrc,
}
