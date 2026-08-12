import React, { useEffect, useRef, useState } from "react"
import { CloseIcon, PlayIcon, ClockIcon, NoVideoIcon } from "./icons"
import { formatPrice } from "../lib/format"

/**
 * Bootstrap's modal handled focus trapping and Escape in the reference build.
 * This does the same in ~40 lines so the plugin ships no Bootstrap.
 */
export function Modal({ title, onClose, children, variant = "video" }) {
  const panelRef = useRef(null)
  const returnFocusTo = useRef(null)

  useEffect(() => {
    returnFocusTo.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const closeButton = panelRef.current?.querySelector("[data-savs-close]")
    if (closeButton) closeButton.focus()

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      if (returnFocusTo.current && returnFocusTo.current.focus) {
        returnFocusTo.current.focus()
      }
    }
  }, [onClose])

  const upgrade = variant === "upgrade"

  return (
    <div
      className="savs-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`savs-modal-content ${upgrade ? "savs-modal-upgrade" : "savs-modal-video"}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
      >
        <div className="savs-modal-header">
          <h2 className="savs-modal-title">{title}</h2>
          <button
            type="button"
            data-savs-close
            className={upgrade ? "savs-upgrade-close-btn" : "savs-btn-close"}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon size={upgrade ? 18 : 20} />
          </button>
        </div>
        <div className="savs-modal-body">{children}</div>
      </div>
    </div>
  )
}

export function VideoGrid({ videos, onSelect }) {
  if (!videos.length) {
    return (
      <div className="savs-empty-state">
        <NoVideoIcon size={48} />
        <h3>No videos found</h3>
        <p>Try adjusting your filters or upload a video.</p>
      </div>
    )
  }

  return (
    <div className="savs-grid savs-grid-videos">
      {videos.map((video) => (
        <button
          type="button"
          className="savs-video-card"
          key={video.id}
          onClick={() => onSelect(video)}
        >
          <span className="savs-thumb-wrapper">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt="" loading="lazy" />
            ) : (
              <span className="savs-thumb-empty">No Preview</span>
            )}
            <span className="savs-play-badge">
              <PlayIcon size={18} />
            </span>
          </span>
          <span className="savs-video-body">
            <span className="savs-video-title">{video.title}</span>
            <span className="savs-video-meta">
              <span className="savs-video-duration">
                <ClockIcon size={12} />
                {video.durationFormatted}
              </span>
              {video.languageName && (
                <span className="savs-video-lang">{video.languageName}</span>
              )}
            </span>
            {video.relativeDate && (
              <span className="savs-video-date">{video.relativeDate}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

/**
 * Selectable radio list with a single Select Plan action, matching the
 * reference. Only plans larger than the current one are offered.
 */
export function UpgradePlans({ plans, currentPlan, onClose }) {
  const upgradePlans = plans.filter(
    (plan) => !(currentPlan && currentPlan.minutes >= plan.minutes)
  )
  const [selectedId, setSelectedId] = useState(
    upgradePlans.length ? String(upgradePlans[0].id) : null
  )

  if (!plans.length) {
    return (
      <Modal title="Upgrade Plan" variant="upgrade" onClose={onClose}>
        <p className="savs-plan-note">No upgrade plans are currently available.</p>
      </Modal>
    )
  }

  if (!upgradePlans.length) {
    return (
      <Modal title="Upgrade Plan" variant="upgrade" onClose={onClose}>
        <p className="savs-plan-note">
          You are already on the highest available plan.
        </p>
      </Modal>
    )
  }

  const selected = upgradePlans.find((plan) => String(plan.id) === selectedId)
  const paymentLink = selected && selected.paymentLink

  const onKeyDown = (event, id) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelectedId(String(id))
    }
  }

  return (
    <Modal title="Upgrade Plan" variant="upgrade" onClose={onClose}>
      <div
        className="savs-plan-option-list"
        role="radiogroup"
        aria-label="Available plans"
      >
        {upgradePlans.map((plan) => {
          const isSelected = String(plan.id) === selectedId
          return (
            <div
              key={plan.id}
              className={`savs-plan-option${isSelected ? " savs-selected" : ""}`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(String(plan.id))}
              onKeyDown={(event) => onKeyDown(event, plan.id)}
            >
              <span className="savs-plan-radio" />
              <div className="savs-plan-info">
                <div className="savs-plan-name">
                  {plan.name || `${plan.minutes} Minutes Plan`}
                </div>
                <p className="savs-plan-desc">
                  Unlimited videos, up to <strong>{plan.minutes} Minutes</strong>{" "}
                  of total playback time
                </p>
              </div>
              <span className="savs-plan-amount">
                ${formatPrice(plan.monthlyPrice)}/Month
              </span>
            </div>
          )
        })}
      </div>

      <div className="savs-select-wrap">
        {paymentLink ? (
          <a
            className="savs-upgrade-select-btn"
            href={paymentLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            Select Plan
          </a>
        ) : (
          <span
            className="savs-upgrade-select-btn savs-disabled"
            aria-disabled="true"
            title="No payment link is available for this plan."
          >
            Select Plan
          </span>
        )}
      </div>
    </Modal>
  )
}
