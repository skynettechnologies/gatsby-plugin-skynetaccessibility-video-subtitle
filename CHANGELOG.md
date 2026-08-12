# Changelog

All notable changes to this project are documented here. This project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0

Initial release.

- Injects the video subtitle widget script into every page during HTML generation.
- Zero configuration: the account is keyed on `window.location.hostname`, so
  listing the plugin as a bare string is a complete install.
- Registers the domain the first time the settings page is opened, including
  local domains, so a development install is a complete one. Builds make no
  network calls.
- Dashboard matches the design used by the other platform integrations, with no
  Bootstrap, jQuery, Font Awesome, or Chart.js dependency.
- Adds a settings and analytics page showing quota usage, per-language
  breakdown, and the processed video library.
- Language toggle wired to the `video-subtitle/settings` and
  `video-subtitle/update-settings` endpoints.
- Upgrade dialog listing available plans with autologin payment links.
- Plugin options validated at startup via `pluginOptionsSchema`.
- Optional re-injection after client-side navigation for sites that mount
  videos on routes reached without a full page load.
