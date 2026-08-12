const path = require("path")
const { DEFAULTS } = require("./compiled/constants")

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    environment: Joi.string()
      .valid("production", "staging")
      .default(DEFAULTS.environment)
      .description("Which API tier to talk to."),

    siteUrl: Joi.string()
      .allow(null, "")
      .default(DEFAULTS.siteUrl)
      .description(
        "Optional override. Leave unset to use the domain the page is served from. Set it to read production data while developing locally."
      ),

    email: Joi.string()
      .email({ tlds: false })
      .allow(null, "")
      .default(DEFAULTS.email)
      .description("Optional contact address recorded at registration."),

    name: Joi.string()
      .allow(null, "")
      .default(DEFAULTS.name)
      .description("Optional account name recorded at registration."),

    manageByPlatform: Joi.boolean()
      .default(DEFAULTS.manageByPlatform)
      .description("Set only when billing is handled by a platform reseller."),

    register: Joi.boolean()
      .default(DEFAULTS.register)
      .description(
        "Register the domain the first time the settings page is opened. Set false if the account already exists."
      ),

    placement: Joi.string()
      .valid("head", "body")
      .default(DEFAULTS.placement)
      .description("Where the widget script tag is written."),

    loadDelay: Joi.number()
      .integer()
      .min(0)
      .max(30000)
      .default(DEFAULTS.loadDelay)
      .description(
        "Milliseconds to wait before loading the widget. 0 uses a deferred tag, which is preferred."
      ),

    reinjectOnRouteChange: Joi.boolean()
      .default(DEFAULTS.reinjectOnRouteChange)
      .description(
        "Re-run the widget after client-side navigation. Only needed if videos on subsequently visited pages lack subtitle controls."
      ),

    settingsPage: Joi.alternatives()
      .try(Joi.boolean(), Joi.string().valid("development", "always", "never"))
      .default(DEFAULTS.settingsPage)
      .description("When to build the settings route."),

    settingsPath: Joi.string()
      .pattern(/^\//, { name: "leading slash" })
      .default(DEFAULTS.settingsPath),

    widgetSrc: Joi.string()
      .uri({ scheme: ["https"] })
      .allow(null, "")
      .default(DEFAULTS.widgetSrc)
      .description("Override the widget script URL. Rarely needed."),
  })

function shouldBuildSettingsPage(mode) {
  if (mode === "development") return process.env.NODE_ENV === "development"
  if (mode === "never") return false
  // true, "always", or anything else truthy.
  return mode !== false
}

/**
 * No registration happens here. The account is keyed on the domain the site is
 * actually served from, which is only knowable in the browser, so registration
 * runs once when the settings page is first opened. That also means a build in
 * CI never transmits anything, and a domain change needs no config edit.
 */
exports.createPages = async ({ actions, reporter }, pluginOptions) => {
  const options = { ...DEFAULTS, ...pluginOptions }

  if (!shouldBuildSettingsPage(options.settingsPage)) return

  actions.createPage({
    path: options.settingsPath,
    component: path.resolve(__dirname, "compiled/settings-page.js"),
    context: {
      options: {
        environment: options.environment,
        siteUrl: options.siteUrl || null,
        register: options.register,
        email: options.email || null,
        name: options.name || null,
        manageByPlatform: options.manageByPlatform,
        settingsPath: options.settingsPath,
      },
    },
  })

  reporter.info(
    `[video-subtitle] Settings page at ${options.settingsPath} — this route is public, so protect it at your host or set settingsPage: "development" if that is a concern.`
  )
}

/**
 * Gatsby does not run Babel over node_modules, so the page component must be
 * pre-compiled. Catching the missing directory here produces a readable error
 * instead of a webpack syntax failure on JSX.
 */
exports.onPreInit = ({ reporter }) => {
  const fs = require("fs")
  if (!fs.existsSync(path.resolve(__dirname, "compiled/settings-page.js"))) {
    reporter.panic(
      `[video-subtitle] compiled/ is missing. Run "npm run build" in the plugin directory before using it.`
    )
  }
}
