const React = require("react")
const { DEFAULTS, SCRIPT_ID, resolveWidgetSrc } = require("./compiled/constants")

/**
 * The tag is written during HTML generation, so the browser parses and runs it
 * like any other script. This is why a <script> placed directly inside a React
 * component never fires: React creates the element, but the browser only
 * executes scripts it parsed from markup or that were created via
 * document.createElement.
 */
exports.onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  pluginOptions = {}
) => {
  const options = { ...DEFAULTS, ...pluginOptions }
  const src = resolveWidgetSrc(options)

  const target =
    options.placement === "head" ? setHeadComponents : setPostBodyComponents

  if (options.loadDelay > 0) {
    // Matches the delayed-injection pattern in the vendor's other integrations.
    // Prefer loadDelay: 0 — a deferred tag already waits for the document and
    // does not push the widget past the visitor's first interaction.
    const inline = [
      `(function(){setTimeout(function(){`,
      `var s=document.createElement("script");`,
      `s.src=${JSON.stringify(src)};`,
      `s.id=${JSON.stringify(SCRIPT_ID)};`,
      `s.defer=true;`,
      `document.body.appendChild(s);`,
      `},${options.loadDelay});})();`,
    ].join("")

    target([
      React.createElement("script", {
        key: "savs-widget-delayed",
        dangerouslySetInnerHTML: { __html: inline },
      }),
    ])
    return
  }

  target([
    React.createElement("script", {
      key: "savs-widget",
      id: SCRIPT_ID,
      src,
      defer: true,
    }),
  ])
}
