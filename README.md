# SkynetAccessibility Video Subtitle

## Publish Captioned Video Content with AI-Powered Subtitles

[SkynetAccessibility VideoSubtitle](https://www.skynettechnologies.com/video-accessibility)
is an AI-powered video accessibility plugin for Gatsby that automatically
generates synchronized subtitles for website videos using advanced speech
recognition.

Improve the accessibility of website videos by automatically generating
synchronized subtitles using AI-powered speech recognition. It integrates with
Gatsby, making it easier to publish accessible multimedia content without
manually creating captions. Supports accessibility initiatives aligned with
WCAG 2.1, 2.2, ADA, Section 508, and EAA EN 301 549, where applicable.

### Features

- Quick subtitle processing
- Compatible with YouTube, Vimeo, and self-hosted video platforms
- Audio and video summary report
- Simple installation and configuration
- Support for existing and newly published videos
- Supporting over 50+ multi-languages
- Unlimited video subtitle processing throughout the selected plan

### Ideal For

Blog videos, news videos, tutorials, landing page videos, announcements,
interviews, webinars, and embedded media.

### Pricing and Plans

| Total Video Playback Time | Price / Month |
| ------------------------- | ------------- |
| Up to 10 Minutes          | $25.00        |
| Up to 25 Minutes          | $39.00        |
| Up to 100 Minutes         | $99.00        |
| Up to 200 Minutes         | $139.00       |

**Note:** An unlimited number of videos can be processed within the selected
plan's total playback time.

---

## Installation

```sh
npm install gatsby-plugin-skynetaccessibility-video-subtitle
```

Add it to `gatsby-config.js`:

```js
module.exports = {
  plugins: [`gatsby-plugin-skynetaccessibility-video-subtitle`],
}
```

That is the whole configuration. No options, no API key, no `siteUrl`. The
account is keyed on the domain the page is served from, read from
`window.location.hostname` at runtime.

Then start the site:

```sh
gatsby develop
```

The widget loads on every page, and the settings dashboard is at
`/skynetaccessibility-video-subtitle`.

## Options

Every option is optional. You will not need any of these for a normal install;
they exist for staging environments and edge cases.

| Option                  | Type              | Default                              | Purpose                                                                       |
| ----------------------- | ----------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| `environment`           | `string`          | `production`                         | `production` or `staging`.                                                     |
| `siteUrl`               | `string`          | `window.location.hostname`           | Override the domain. Use it to read production data from localhost.            |
| `email`                 | `string`          | `null`                               | Optional contact address recorded at registration.                             |
| `name`                  | `string`          | `null`                               | Optional account name recorded at registration.                                |
| `manageByPlatform`      | `boolean`         | `false`                              | Set only when billing is handled by a platform reseller.                       |
| `register`              | `boolean`         | `true`                               | Register the domain when the settings page is opened.                          |
| `placement`             | `string`          | `body`                               | `body` or `head`.                                                              |
| `loadDelay`             | `number`          | `0`                                  | Milliseconds to wait before loading. `0` uses a deferred tag, which is better. |
| `reinjectOnRouteChange` | `boolean`         | `false`                              | Re-run the widget after client-side navigation.                                |
| `settingsPage`          | `string\|boolean` | `true`                               | `true`, `false`, `"development"`, or `"never"`.                                  |
| `settingsPath`          | `string`          | `/skynetaccessibility-video-subtitle`| Route for the dashboard.                                                       |
| `widgetSrc`             | `string`          | resolved from `environment`          | Override the script URL. Rarely needed.                                        |

Options are validated when the site starts. A misspelled key or wrong type
fails immediately with a message naming the field, rather than building a site
with a silently missing widget.

## The settings page

The dashboard reads live data from the API and shows:

- Videos captioned, plan allowance, playback processed, and remaining quota
- A usage ring against the plan limit, with warnings as it runs out
- Videos by subtitle language
- The processed video library, with click-to-preview
- The **Generate subtitles based on widget language** toggle, saved to your
  account immediately
- An upgrade dialog listing larger plans with autologin payment links

It is visually identical to the WordPress, Drupal, Sanity, and BigCommerce
dashboards — same palette, gradient header, stat cards, usage ring, and plan
picker — rebuilt in React with no Bootstrap, jQuery, Font Awesome, or Chart.js.

The domain it is reporting on is printed under the page heading, so it is always
clear which account you are looking at.

Figures are scoped to the current calendar month, matching the monthly billing
period.

### Protecting the route

The dashboard is built into production, because that is where you need it — it is
how you manage the plugin on a live site. It carries `noindex, nofollow`, but
Gatsby has no authentication layer, so **anyone who knows the URL can open it.**
It shows usage figures and links to payment pages; it cannot change your plan or
reveal payment details.

Your options, in order of effort:

- Change `settingsPath` to something unguessable.
- Put HTTP basic auth on the path at your host. Netlify, Cloudflare, and Vercel
  all support this with a few lines of config.
- Set `settingsPage: "development"` to keep it out of production entirely, and
  read production data locally by setting `siteUrl` to your live domain.

## Development

Because registration is not restricted to public domains, a local install is a
complete one. Run `gatsby develop`, open the settings path, and the domain is
registered and the dashboard populated from the API.

If you would rather see an existing account's data instead of registering your
local hostname, point the plugin at that domain:

```js
options: { siteUrl: `https://your-live-domain.com` }
```

## Registration

The first time the settings page is opened on a public domain, the plugin POSTs
to `video-subtitle/get-start` with that domain, the platform name, and the
`email` and `name` you configured if any. This creates or resumes the account.

The endpoint is idempotent, so there is no separate install step to remember and
nothing to keep in sync — deploying to a new domain registers it the first time
you open the dashboard there.

Every domain is registered, including local ones such as `localhost` or a
`.test` hostname. That is deliberate: it lets you complete the whole install and
see the dashboard populate before the site is deployed anywhere.

Builds make no network calls at all. Registration happens in the browser, when
you open the dashboard, and never from a visitor's page view. Set
`register: false` to skip it entirely.

## Client-side navigation

Gatsby navigations do not reload the document, so the widget scans the DOM once,
on whichever page the visitor landed on. If videos on pages reached by in-app
navigation come up without subtitle controls:

```js
options: {
  reinjectOnRouteChange: true,
}
```

This re-runs the widget script on each route change. It is a workaround rather
than an API — it is heavier than a refresh call and can register duplicate
listeners — so leave it off unless you observe the problem.

## Adding the script manually

The plugin injects the tag for you. If you would rather do it yourself, place
this in your layout's footer and set `settingsPage: false, register: false`:

```html
<script id="aioa-adavs" defer
  src="https://www.skynettechnologies.com/accessibility/js/video-subtitle/video-subtitle-widget.js"></script>
```

Note that a `<script>` written inside a React component body will **not**
execute — React creates the element but the browser never parses it. Use
Gatsby's `<Script>` component from `gatsby`, or the SSR APIs, which is what this
plugin does.

## CORS Policy Configuration

To avoid CORS policy issues, ensure the following URLs are allowed in your
website. These URLs should be added to your CORS configuration or trusted
domains list.

| Domain                             | Description                         | Usage                    |
| ---------------------------------- | ----------------------------------- | ------------------------ |
| `https://*.skynettechnologies.com` | Skynet Technologies (Global Domain) | API access and resources |
| `https://*.skynettechnologies.us`  | Skynet Technologies (US Domain)     | API access and resources |

### Instructions

1. Update your server's CORS configuration to include these URLs.
2. Ensure wildcard subdomains (`*`) are supported where necessary.
3. Verify the application functionality by testing requests to these domains.
4. If issues persist, consult the documentation for CORS configuration guidance.

If you set a Content Security Policy, the widget and dashboard need:

```
script-src  https://www.skynettechnologies.com
connect-src https://ada.skynettechnologies.us https://*.skynettechnologies.com
img-src     https://img.youtube.com
frame-src   https://www.youtube.com https://player.vimeo.com
```

## Troubleshooting

**The dashboard is empty but the account exists.** Check the domain printed
under the page heading. The API keys accounts on a bare hostname, and the plugin
strips the protocol, `www.`, port, and path for you — but a site served from
both `example.com` and `shop.example.com` is two separate accounts.

**Requests fail with no status code.** That is a CORS rejection, not a bug — the
API has to allow your origin.

**The widget does not appear.** Confirm the tag is in the page source, not just
the React tree. `curl -s https://example.com | grep aioa-adavs` should find it.
If it is missing, stop the dev server, delete `.cache`, and start again — the
SSR API only runs during HTML generation.

**`compiled/ is missing`.** You are working from a git checkout rather than the
npm package. Run `npm run build` in the plugin directory.

## Building from source

```sh
git clone https://github.com/skynettechnologies/gatsby-plugin-skynetaccessibility-video-subtitle
cd gatsby-plugin-skynetaccessibility-video-subtitle
npm install
npm run watch
```

`src/` holds the source; Babel compiles it to `compiled/`, which is what
`gatsby-node.js` points at and what ships to npm. **This step is not optional:**
Gatsby does not run Babel over `node_modules`, so an uncompiled JSX page
component throws a webpack syntax error the moment someone installs the package.

To test against a real site, link it:

```sh
npm link
cd ../my-gatsby-site
npm link gatsby-plugin-skynetaccessibility-video-subtitle
```

### Publishing

```sh
npm run build
npm pack --dry-run     # confirm compiled/ is included and src/ is not
npm version patch
npm publish --access public
git push --follow-tags
```

`prepublishOnly` rebuilds automatically, so a stale `compiled/` cannot be
published by accident.

## Support Options

**Submit a Support Request**
Please visit our [support page](https://www.skynettechnologies.com/report-accessibility-problem)
and fill out the form. Our team will get back to you as soon as possible.

**Send Us an Email**
Alternatively, you can send an email to our support team:
[hello@skynettechnologies.com](mailto:hello@skynettechnologies.com)

## Accessibility Partnership Opportunities

### [Accessibility Agency Partnership](https://www.skynettechnologies.com/agency-partners)

Partner with us as an agency to provide comprehensive Gatsby ADA, EAA, WCAG
accessibility solutions to clients. Get access to exclusive resources, training,
and support to implement and manage accessibility features effectively.

### [Accessibility Affiliate Partnership](https://www.skynettechnologies.com/affiliate-partner)

Sign up for our affiliate program and earn commissions by promoting the
accessibility Gatsby plugin. Share our widget with your network and help
businesses improve their website accessibility while generating revenue.

For more details, explore the
[Accessibility Partnership Opportunities Page](https://www.skynettechnologies.com/partner-program).

## Credits

This addon is developed and maintained by
[website accessibility company](https://www.skynettechnologies.com/) — Skynet
Technologies USA LLC.

### Current Maintainers

- [Skynet Technologies USA LLC](https://github.com/skynettechnologies)
