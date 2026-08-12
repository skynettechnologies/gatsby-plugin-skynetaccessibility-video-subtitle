import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "./lib/api"
import { resolveWebsiteUrl } from "./constants"
import STYLES from "./lib/styles"
import {
  decorateVideos,
  filterVideos,
  computeUsage,
  languageBreakdown,
  formatPrice,
  thisMonthRange,
} from "./lib/format"
import { UsageDonut, LanguagePie } from "./components/charts"
import { Modal, VideoGrid, UpgradePlans } from "./components/ui"
import {
  CaptionIcon,
  VideoIcon,
  ClockIcon,
  HourglassIcon,
  GaugeIcon,
  AlertIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  RetryIcon,
  ArrowUpIcon,
} from "./components/icons"

export default function VideoSubtitleSettings({ pageContext }) {
  const options = (pageContext && pageContext.options) || {}
  const environment = options.environment || "production"

  // window.location.hostname does not exist during SSR, so the domain is
  // resolved in an effect. null means "not resolved yet".
  const [websiteUrl, setWebsiteUrl] = useState(null)

  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  const [videos, setVideos] = useState([])
  const [plans, setPlans] = useState([])
  const [quotaMinutes, setQuotaMinutes] = useState(0)
  const [activePackage, setActivePackage] = useState(null)
  const [followWidgetLanguage, setFollowWidgetLanguage] = useState(true)
  const [savingSetting, setSavingSetting] = useState(false)
  const [language, setLanguage] = useState("all")
  const [preview, setPreview] = useState(null)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    setWebsiteUrl(resolveWebsiteUrl(options.siteUrl))
  }, [options.siteUrl])

  const client = useMemo(() => {
    if (!websiteUrl) return null
    try {
      return createClient({ environment, siteUrl: websiteUrl })
    } catch (createError) {
      return null
    }
  }, [environment, websiteUrl])

  const load = useCallback(async () => {
    if (websiteUrl === null) return

    if (!client) {
      setError(
        "Could not determine this site's domain from the browser. If you are rendering this page outside a browser, set siteUrl in the plugin options."
      )
      setStatus("error")
      return
    }

    setStatus("loading")
    setError(null)

    try {
      // Registration comes first, for every domain. The endpoint creates or
      // resumes the account, so a site that has never been seen before gets
      // one here rather than needing a separate install step.
      if (options.register) {
        await client
          .register({
            email: options.email,
            name: options.name,
            manageByPlatform: options.manageByPlatform,
          })
          .catch(() => {
            // Never blank a dashboard that may already have good data behind
            // it just because the registration call failed.
          })
      }

      // Languages and settings are independent of the video list, so they run
      // together. A failure in either should not blank the whole dashboard.
      const [languageMap, settings] = await Promise.all([
        client.getActiveLanguages().catch(() => ({})),
        client.getSettings().catch(() => ({ followWidgetLanguage: true })),
      ])

      const [details, packages] = await Promise.all([
        client.getVideoDetails(),
        client.getPackages().catch(() => []),
      ])

      const decorated = decorateVideos(details.videos, languageMap)
      const matchedPlan = packages.find(
        (plan) => plan.id === details.activePackageId
      )

      setVideos(decorated)
      setPlans(packages)
      setActivePackage(matchedPlan || null)
      setQuotaMinutes(matchedPlan ? matchedPlan.minutes : details.totalMinutes)
      setFollowWidgetLanguage(settings.followWidgetLanguage)
      setStatus("ready")
    } catch (loadError) {
      setError(loadError.message || "Failed to load data.")
      setStatus("error")
    }
  }, [
    client,
    websiteUrl,
    options.register,
    options.email,
    options.name,
    options.manageByPlatform,
  ])

  useEffect(() => {
    load()
  }, [load])

  const onToggleLanguage = async (event) => {
    const next = event.target.checked
    setFollowWidgetLanguage(next)
    setSavingSetting(true)
    try {
      await client.updateSettings({ followWidgetLanguage: next })
    } catch (saveError) {
      // Put the switch back so it never shows a state the server rejected.
      setFollowWidgetLanguage(!next)
      setError(`Could not save that setting: ${saveError.message}`)
    } finally {
      setSavingSetting(false)
    }
  }

  // The reference scopes the dashboard to the current month, matching the
  // monthly billing period. Its date picker is present but hidden.
  const range = thisMonthRange()
  const visible = filterVideos(videos, { ...range, languageCode: language })
  const usage = computeUsage(visible, quotaMinutes)
  const breakdown = languageBreakdown(visible)
  const allLanguages = languageBreakdown(videos)
  const ready = status === "ready"

  return (
    <div className="savs-root">
      <style>{STYLES}</style>

      <div className="savs-page-header">
        <div>
          <h1>
            <CaptionIcon size={26} />
            SkynetAccessibility Video Subtitle
          </h1>
          <p className="savs-domain">
            {websiteUrl || "Resolving domain…"}
            {environment !== "production" && ` · ${environment}`}
          </p>
        </div>
        <div className="savs-header-right">
          {ready && (
            <>
              <span className="savs-plan-price-badge">
                {activePackage && activePackage.monthlyPrice > 0
                  ? `$${formatPrice(activePackage.monthlyPrice)} / Per Month`
                  : "Free Plan"}
              </span>
              <span className="savs-badge-status savs-badge-active">
                <CheckCircleIcon size={14} /> Active Status
              </span>
              <button
                type="button"
                className="savs-upgrade-plan-btn"
                onClick={() => setShowUpgrade(true)}
              >
                <ArrowUpIcon size={14} /> Upgrade Plan
              </button>
            </>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="savs-spinner-overlay">
          <div className="savs-spinner" />
          <p>Loading video data…</p>
        </div>
      )}

      {status === "error" && (
        <div className="savs-error-banner">
          <AlertCircleIcon />
          <div>
            <p>{error}</p>
            <button type="button" className="savs-retry-btn" onClick={load}>
              <RetryIcon size={13} /> Retry
            </button>
          </div>
        </div>
      )}

      {ready && (
        <>
          <div className="savs-filters-row">
            <div className="savs-widget-language-setting">
              <input
                type="checkbox"
                className="savs-switch"
                id="savs-lang-toggle"
                checked={followWidgetLanguage}
                disabled={savingSetting}
                onChange={onToggleLanguage}
              />
              <label htmlFor="savs-lang-toggle">
                Generate subtitles based on widget language
              </label>
            </div>

            <select
              className="savs-filter-select"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              aria-label="Filter by language"
            >
              <option value="all">All Languages</option>
              {allLanguages.map((entry) => (
                <option value={entry.code} key={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="savs-error-banner">
              <AlertCircleIcon />
              <p>{error}</p>
            </div>
          )}

          {usage.quotaExhausted && (
            <div className="savs-alert-quota">
              <AlertIcon size={24} />
              <div>
                <div className="savs-alert-title">Quota Limit Reached</div>
                <p>
                  You have reached your quota limit. Please upgrade your plan to
                  continue.
                </p>
              </div>
            </div>
          )}

          <div className="savs-grid savs-grid-stats">
            <Stat
              icon={<VideoIcon size={24} />}
              label="Videos Remediated"
              value={usage.videoCount}
            />
            <Stat
              icon={<ClockIcon size={24} />}
              label="Total Time Limit"
              value={
                <>
                  {usage.quotaMinutes} <small>min</small>
                </>
              }
            />
            <Stat
              icon={<HourglassIcon size={24} />}
              label="Spent Duration"
              value={usage.usedFormatted}
            />
            <Stat
              icon={<GaugeIcon size={24} />}
              label="Remaining Duration"
              value={usage.remainingFormatted}
              flag={usage.runningLow ? "Low remaining quota" : null}
            />
          </div>

          <div className="savs-grid savs-grid-charts">
            <div className="savs-chart-card">
              <UsageDonut
                percent={usage.percentUsed}
                ringColor={usage.ringColor}
                caption={usage.usageCaption}
              />
            </div>
            <div className="savs-chart-card">
              <LanguagePie breakdown={breakdown} />
            </div>
          </div>

          <div className="savs-video-container">
            <div className="savs-library-head">
              <h2>
                <VideoIcon size={20} />
                Video Library
              </h2>
              <span className="savs-count-badge">
                {visible.length} Videos
              </span>
            </div>
            <VideoGrid videos={visible} onSelect={setPreview} />
          </div>
        </>
      )}

      <p className="savs-foot">
        Subtitles are generated by{" "}
        <a
          href="https://www.skynettechnologies.com/video-accessibility"
          target="_blank"
          rel="noreferrer noopener"
        >
          SkynetAccessibility Video Subtitle
        </a>
        .
      </p>

      {preview && (
        <Modal title="Video Preview" onClose={() => setPreview(null)}>
          <div className="savs-frame">
            <iframe
              src={preview.videoUrl}
              title={preview.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal>
      )}

      {showUpgrade && (
        <UpgradePlans
          plans={plans}
          currentPlan={activePackage}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  )
}

function Stat({ icon, label, value, flag }) {
  return (
    <div className="savs-stat-card">
      <span className="savs-icon-box">{icon}</span>
      <div>
        <div className="savs-stat-label">{label}</div>
        <div className="savs-stat-value">{value}</div>
        {flag && (
          <div className="savs-low-badge">
            <AlertCircleIcon size={12} /> {flag}
          </div>
        )}
      </div>
    </div>
  )
}

export const Head = () => (
  <>
    <title>Video Subtitle · Analytics &amp; Plans</title>
    <meta name="robots" content="noindex, nofollow" />
  </>
)
