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

```code
script-src  https://www.skynettechnologies.com
connect-src https://ada.skynettechnologies.us https://*.skynettechnologies.com
img-src     https://img.youtube.com
frame-src   https://www.youtube.com https://player.vimeo.com
```

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
