import React from "react"

/**
 * The reference implementation pulled in the whole Font Awesome stylesheet for
 * nine glyphs. These are inline so the plugin adds no external requests and
 * works with a strict CSP.
 */

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
}

const Icon = ({ size, children, ...rest }) => (
  <svg {...base} width={size || base.width} height={size || base.height} {...rest}>
    {children}
  </svg>
)

export const CaptionIcon = (props) => (
  <Icon {...props}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M10 10.5a2.5 2.5 0 1 0 0 3M17.5 10.5a2.5 2.5 0 1 0 0 3" />
  </Icon>
)

export const VideoIcon = (props) => (
  <Icon {...props}>
    <rect x="2" y="5" width="14" height="14" rx="3" />
    <path d="m16 11 6-4v10l-6-4" />
  </Icon>
)

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Icon>
)

export const HourglassIcon = (props) => (
  <Icon {...props}>
    <path d="M7 3h10M7 21h10" />
    <path d="M17 3v3.5L12 12l5 5.5V21M7 3v3.5L12 12l-5 5.5V21" />
  </Icon>
)

export const GaugeIcon = (props) => (
  <Icon {...props}>
    <path d="M3.5 18a9 9 0 1 1 17 0" />
    <path d="M12 13.5 16 9" />
  </Icon>
)

export const PlayIcon = (props) => (
  <Icon {...props} fill="currentColor" stroke="none">
    <path d="M8 5.5v13l11-6.5z" />
  </Icon>
)

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
)

export const AlertIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4M12 17.5v.01" />
  </Icon>
)

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m4 12.5 5 5L20 6.5" />
  </Icon>
)

export const ArrowUpIcon = (props) => (
  <Icon {...props}>
    <path d="M12 20V4M5.5 10.5 12 4l6.5 6.5" />
  </Icon>
)

export const CheckCircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </Icon>
)

export const AlertCircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16v.01" />
  </Icon>
)

export const RetryIcon = (props) => (
  <Icon {...props}>
    <path d="M20 11a8 8 0 1 0-2.3 6.3" />
    <path d="M20 5v6h-6" />
  </Icon>
)

export const NoVideoIcon = (props) => (
  <Icon {...props} size={props.size || 44}>
    <rect x="2" y="5" width="14" height="14" rx="3" />
    <path d="m16 11 6-4v10l-6-4" />
    <path d="M3 3l18 18" />
  </Icon>
)
