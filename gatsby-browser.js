const { DEFAULTS, SCRIPT_ID, resolveWidgetSrc } = require("./compiled/constants")

/**
 * Gatsby navigations do not reload the document, so the widget scans the DOM
 * once — on whichever page the visitor landed on. If videos on pages reached by
 * in-app navigation come up without subtitle controls, set
 * reinjectOnRouteChange: true.
 *
 * This is a workaround rather than an API. Re-running a third-party script is
 * heavier than calling a refresh function and can register duplicate
 * listeners. If the widget ever exposes a re-init hook, call that instead.
 */
exports.onRouteUpdate = ({ prevLocation }, pluginOptions = {}) => {
  const options = { ...DEFAULTS, ...pluginOptions }

  // The landing page already has the server-rendered tag.
  if (!prevLocation) return
  if (!options.reinjectOnRouteChange) return

  const existing = document.getElementById(SCRIPT_ID)
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing)
  }

  const tag = document.createElement("script")
  tag.id = SCRIPT_ID
  tag.src = resolveWidgetSrc(options)
  tag.defer = true
  document.body.appendChild(tag)
}
