import React from "react"
import { CHART_COLORS } from "../lib/format"

/**
 * SVG rather than Chart.js. Two charts do not justify a canvas library, and the
 * geometry below matches the reference exactly: a 180px ring with a 20px
 * stroke, and a pie with 2px white separators.
 */

export function UsageDonut({ percent, ringColor, caption }) {
  const size = 180
  const stroke = 20
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <>
      <div className="savs-circular-progress">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
          role="img"
          aria-label={`${clamped}% of the plan allowance used`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1EEFF"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="savs-center-text">
          <span className="savs-pct">{clamped}%</span>
          <span className="savs-pct-label">Usage</span>
        </div>
      </div>
      <p className="savs-usage-caption">{caption}</p>
    </>
  )
}

function slicePath(cx, cy, radius, startAngle, endAngle) {
  const toPoint = (angle) => {
    const radians = ((angle - 90) * Math.PI) / 180
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)]
  }
  const [x1, y1] = toPoint(startAngle)
  const [x2, y2] = toPoint(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export function LanguagePie({ breakdown }) {
  const total = breakdown.reduce((sum, entry) => sum + entry.count, 0)

  if (!total) {
    return <p className="savs-no-language">No language data</p>
  }

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 2

  let angle = 0
  const slices = breakdown.map((entry, index) => {
    const sweep = (entry.count / total) * 360
    const path =
      breakdown.length === 1 ? null : slicePath(cx, cy, radius, angle, angle + sweep)
    angle += sweep
    return { ...entry, path, color: CHART_COLORS[index % CHART_COLORS.length] }
  })

  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ maxWidth: "100%", height: "auto" }}
        role="img"
        aria-label={`Videos by subtitle language across ${breakdown.length} language${breakdown.length === 1 ? "" : "s"}`}
      >
        {slices.map((slice) =>
          slice.path ? (
            <path
              key={slice.code}
              d={slice.path}
              fill={slice.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            >
              <title>{`${slice.name}: ${slice.count} videos`}</title>
            </path>
          ) : (
            <circle
              key={slice.code}
              cx={cx}
              cy={cy}
              r={radius}
              fill={slice.color}
              stroke="#FFFFFF"
              strokeWidth="2"
            >
              <title>{`${slice.name}: ${slice.count} videos`}</title>
            </circle>
          )
        )}
      </svg>
      <ul className="savs-pie-legend">
        {slices.map((slice) => (
          <li key={slice.code}>
            <span
              className="savs-legend-dot"
              style={{ background: slice.color }}
            />
            <span>{slice.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
