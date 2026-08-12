/**
 * Language codes the API has returned historically, mapped to the codes the
 * active-language endpoint uses today. Without this, older records show a raw
 * code like `en-US` where newer ones show "English".
 */
export const LEGACY_LANGUAGE_CODES = {
  iw: "he",
  in: "id",
  ji: "yi",
  jw: "jv",
  "hi-IN": "hi",
  "en-US": "en",
  "ja-JP": "ja",
  "pl-PL": "pl",
}

export const CHART_COLORS = [
  "#C9BFFB",
  "#BEDBF8",
  "#C7F0D4",
  "#FCE7B0",
  "#B8AECB",
  "#D6AEE0",
  "#F6E1C0",
  "#F4C6C6",
  "#BEE9E4",
]

const YOUTUBE_PATTERNS = [
  /youtube\.com\/embed\/([^?&/]+)/,
  /youtube\.com\/watch\?v=([^?&/]+)/,
  /youtu\.be\/([^?&/]+)/,
  /youtube\.com\/shorts\/([^?&/]+)/,
]

export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

export function thumbnailFor(url) {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (n) => String(n).padStart(2, "0")
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`
}

/** Minutes:seconds only — what the reference uses for Remaining Duration. */
export function formatMinSec(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const minutes = Math.floor(total / 60)
  const secs = total % 60
  return `${minutes}:${String(secs).padStart(2, "0")}`
}

export function formatPrice(value) {
  const amount = Number(value) || 0
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2)
}

export function formatTimeAgo(dateString) {
  if (!dateString) return ""
  const then = new Date(dateString)
  if (Number.isNaN(then.getTime())) return ""

  const seconds = Math.floor((Date.now() - then.getTime()) / 1000)
  if (seconds < 60) return "Just now"

  const units = [
    ["minute", 60],
    ["hour", 60],
    ["day", 24],
    ["week", 7],
    ["month", 4.34],
    ["year", 12],
  ]

  let value = seconds
  for (let i = 0; i < units.length; i += 1) {
    const [label, divisor] = units[i]
    value = value / divisor
    const next = units[i + 1]
    if (!next || value < next[1]) {
      const rounded = Math.max(1, Math.floor(value))
      return `${rounded} ${label}${rounded === 1 ? "" : "s"} ago`
    }
  }
  return then.toLocaleDateString()
}

export function thisMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: now.toISOString().split("T")[0],
    label: "This month",
  }
}

export function lastMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const end = new Date(now.getFullYear(), now.getMonth(), 0)
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
    label: "Last month",
  }
}

export function allTimeRange() {
  return { startDate: "", endDate: "", label: "All time" }
}

export function resolveLanguage(code, languageMap) {
  const normalized = LEGACY_LANGUAGE_CODES[code] || code || "Unknown"
  return {
    code: normalized,
    name: (languageMap && languageMap[normalized]) || normalized,
  }
}

export function decorateVideos(videos, languageMap) {
  return videos.map((video) => {
    const language = resolveLanguage(video.language, languageMap)
    return {
      ...video,
      languageCode: language.code,
      languageName: language.name,
      durationFormatted: formatDuration(video.durationSeconds),
      thumbnail: thumbnailFor(video.videoUrl),
      relativeDate: formatTimeAgo(video.createdAt),
    }
  })
}

export function filterVideos(videos, { startDate, endDate, languageCode }) {
  return videos.filter((video) => {
    if (languageCode && languageCode !== "all") {
      if (video.languageCode !== languageCode) return false
    }
    if (!startDate || !endDate) return true
    const created = video.createdAt ? String(video.createdAt).split("T")[0] : ""
    if (!created) return true
    return created >= startDate && created <= endDate
  })
}

export function computeUsage(videos, quotaMinutes) {
  const usedSeconds = videos.reduce(
    (sum, video) => sum + (video.durationSeconds || 0),
    0
  )
  const quotaSeconds = Math.max(0, Number(quotaMinutes) || 0) * 60
  const remainingSeconds = Math.max(0, quotaSeconds - usedSeconds)
  const percentUsed =
    quotaSeconds > 0 ? Math.min(100, Math.round((usedSeconds / quotaSeconds) * 100)) : 0

  const minutes = Number(quotaMinutes) || 0
  const usedMin = Math.floor(usedSeconds / 60)
  const usedSec = Math.floor(usedSeconds % 60)

  return {
    videoCount: videos.length,
    usedSeconds,
    usedFormatted: formatDuration(usedSeconds),
    quotaMinutes: minutes,
    remainingSeconds,
    remainingFormatted: formatMinSec(remainingSeconds),
    percentUsed,
    // Reference thresholds: red at 90%, amber above 70%.
    ringColor:
      percentUsed >= 90
        ? "#E74C3C"
        : percentUsed > 70
          ? "#F39C12"
          : "#420083",
    usageCaption: `${usedMin} min and ${usedSec} sec used out of ${minutes} min`,
    quotaExhausted: minutes > 0 && remainingSeconds <= 0,
    // The reference only flags this when there is at least one video.
    runningLow:
      minutes > 0 &&
      videos.length > 0 &&
      remainingSeconds / 60 <= 2,
  }
}

export function languageBreakdown(videos) {
  const counts = new Map()
  videos.forEach((video) => {
    const key = video.languageCode || "Unknown"
    if (!counts.has(key)) {
      counts.set(key, { code: key, name: video.languageName || key, count: 0 })
    }
    counts.get(key).count += 1
  })
  // Array.from, not [...counts.values()]. The Babel preset compiles array
  // spread in loose mode to [].concat(x), which wraps a Map iterator as a
  // single element instead of spreading it — the legend and language filter
  // silently come out empty.
  return Array.from(counts.values()).sort((a, b) => a.name.localeCompare(b.name))
}
