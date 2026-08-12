/**
 * Ported from the reference vs_style.css so the Gatsby dashboard is visually
 * identical to the other platform integrations. Every selector is scoped under
 * .savs- so nothing leaks into the host site, and the values below are the same
 * ones the original Bootstrap build produced — Bootstrap itself is not shipped.
 */
const STYLES = `
.savs-root {
  --savs-primary: #420083;
  --savs-primary-dark: #340068;
  --savs-primary-light: #F1EEFF;
  --savs-accent: #FF6B6B;
  --savs-success: #2ECC71;
  --savs-warning: #F39C12;
  --savs-danger: #E74C3C;
  --savs-dark: #20223B;
  --savs-gray: #8A8DA6;
  --savs-light-gray: #F8F7FC;
  --savs-border: #ECEAF7;
  --savs-white: #FFFFFF;
  --savs-shadow: 0 1px 4px rgba(32, 34, 59, 0.06);
  --savs-shadow-hover: 0 4px 12px rgba(32, 34, 59, 0.10);

  background: var(--savs-light-gray);
  color: var(--savs-dark);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  min-height: 100vh;
  padding: 1.5rem;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
.savs-root *, .savs-root *::before, .savs-root *::after { box-sizing: border-box; }

/* ---------- page header ---------- */
.savs-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(78deg, #D5D1FD 10.33%, #EDEBFF 121.25%);
  padding: 15px;
  border-radius: 11px;
}
.savs-page-header h1 {
  font-weight: 700;
  font-size: 1.75rem;
  color: var(--savs-dark);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.savs-page-header h1 svg { color: var(--savs-primary); flex: none; }
.savs-domain { margin: 4px 0 0 2.2rem; font-size: 0.8rem; color: var(--savs-gray); }
.savs-header-right { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }

.savs-plan-price-badge {
  color: var(--savs-primary);
  padding: 0.3rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.2rem;
}
.savs-badge-status {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.savs-badge-active { background: #1f5c21; color: #fff; }
.savs-badge-idle { background: #6c757d; color: #fff; }

.savs-upgrade-plan-btn {
  border-radius: 10px;
  font-weight: 600;
  background: var(--savs-primary);
  color: #fff;
  border: 0;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: inherit;
}
.savs-upgrade-plan-btn:hover { background: var(--savs-primary); }

/* ---------- filters ---------- */
.savs-filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.savs-widget-language-setting {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}
.savs-switch {
  appearance: none;
  -webkit-appearance: none;
  width: 43px;
  height: 24px;
  border-radius: 999px;
  background: #dfdce9;
  border: 1px solid #d3cfe2;
  position: relative;
  cursor: pointer;
  margin: 0 9px 0 0;
  flex: none;
  transition: background 0.15s, border-color 0.15s;
}
.savs-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s;
}
.savs-switch:checked { background: var(--savs-primary); border-color: var(--savs-primary); }
.savs-switch:checked::after { transform: translateX(19px); }
.savs-switch:disabled { opacity: 0.55; cursor: progress; }
.savs-switch:focus-visible { outline: 2px solid var(--savs-primary); outline-offset: 2px; }

.savs-filter-select {
  border-radius: 8px;
  padding: 0.3rem 1rem;
  border: 1px solid var(--savs-border);
  background: var(--savs-white);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--savs-dark);
  min-width: 140px;
}
.savs-filter-select:focus {
  border-color: var(--savs-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 0, 131, 0.15);
}

/* ---------- alerts ---------- */
.savs-alert-quota {
  border-radius: 12px;
  border: none;
  background: #fdecea;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.savs-alert-quota svg { color: var(--savs-danger); flex: none; }
.savs-alert-quota .savs-alert-title { font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem; }
.savs-alert-quota p { margin: 0; font-size: 0.9rem; }

.savs-error-banner {
  border-radius: 12px;
  padding: 1rem 1.25rem;
  background: #FEF2F2;
  border-left: 4px solid var(--savs-danger);
  color: #991B1B;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.savs-error-banner svg { flex: none; margin-top: 2px; }
.savs-error-banner p { margin: 0; font-size: 0.9rem; }
.savs-retry-btn {
  margin-top: 0.75rem;
  border-radius: 8px;
  border: 1px solid #d99;
  background: transparent;
  color: #991B1B;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.savs-retry-btn:hover { background: #fee; }

/* ---------- cards & stats ---------- */
.savs-grid { display: grid; gap: 1rem; }
.savs-grid-stats { grid-template-columns: repeat(4, 1fr); margin-bottom: 1rem; }
.savs-grid-charts { grid-template-columns: 1fr 1fr; margin-bottom: 1.5rem; }
.savs-grid-videos { grid-template-columns: repeat(4, 1fr); }

.savs-stat-card {
  border-radius: 16px;
  box-shadow: var(--savs-shadow);
  border: none;
  background: var(--savs-white);
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
}
.savs-stat-card:hover { transform: translateY(-2px); box-shadow: var(--savs-shadow-hover); }
.savs-icon-box {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 12px;
  background: var(--savs-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--savs-primary);
}
.savs-stat-label { font-size: 16px; font-weight: 500; color: var(--savs-primary); }
.savs-stat-value {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}
.savs-stat-value small { font-size: 14px; font-weight: 400; }
.savs-low-badge {
  color: var(--savs-danger);
  font-size: 12px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.savs-chart-card {
  border-radius: 16px;
  box-shadow: var(--savs-shadow);
  background: var(--savs-white);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
}
.savs-chart-card:hover { transform: translateY(-2px); box-shadow: var(--savs-shadow-hover); }

.savs-circular-progress { position: relative; width: 180px; height: 180px; }
.savs-circular-progress .savs-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.savs-circular-progress .savs-pct {
  font-size: 34px;
  font-weight: 700;
  color: var(--savs-primary);
  line-height: 1;
}
.savs-circular-progress .savs-pct-label {
  font-size: 15px;
  font-weight: 600;
  margin-top: 4px;
  color: var(--savs-gray);
}
.savs-usage-caption { margin: 1rem 0 0; font-size: 14px; text-align: center; }

.savs-pie-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  padding: 0;
  list-style: none;
}
.savs-pie-legend li { display: flex; align-items: center; gap: 0.5rem; font-size: 13px; font-weight: 500; }
.savs-legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex: none; }
.savs-no-language { color: var(--savs-gray); font-size: 16px; }

/* ---------- video library ---------- */
.savs-video-container {
  border-radius: 16px;
  box-shadow: var(--savs-shadow);
  background: var(--savs-white);
  padding: 1.5rem;
}
.savs-library-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.savs-library-head h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.savs-library-head h2 svg { color: var(--savs-primary); }
.savs-count-badge {
  font-weight: 600;
  background: var(--savs-primary-light);
  color: var(--savs-primary);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 13px;
}

.savs-video-card {
  border-radius: 12px;
  box-shadow: var(--savs-shadow);
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
  overflow: hidden;
  background: var(--savs-white);
  border: none;
  height: 100%;
  padding: 0;
  text-align: left;
  font-family: inherit;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.savs-video-card:hover { transform: translateY(-2px); box-shadow: var(--savs-shadow-hover); }
.savs-video-card:focus-visible { outline: 2px solid var(--savs-primary); outline-offset: 2px; }
.savs-thumb-wrapper {
  position: relative;
  padding-top: 56.25%;
  background: #f0edf7;
  display: block;
}
.savs-thumb-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.savs-thumb-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--savs-gray);
  font-size: 13px;
}
.savs-play-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--savs-primary);
  transition: background 0.2s;
}
.savs-video-card:hover .savs-play-badge { background: rgba(255, 255, 255, 0.95); }
.savs-video-body { padding: 0.5rem 0.75rem 0.75rem; display: block; }
.savs-video-title {
  font-weight: 600;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.savs-video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 12px;
}
.savs-video-meta .savs-video-duration { display: flex; align-items: center; gap: 0.25rem; }
.savs-video-lang { font-size: 12px; font-weight: 500; }
.savs-video-date { margin-top: 0.25rem; font-size: 12px; color: var(--savs-gray); }

.savs-empty-state { padding: 3rem 1rem; text-align: center; }
.savs-empty-state svg { color: var(--savs-gray); }
.savs-empty-state h3 { margin: 1rem 0 0.25rem; font-size: 1.15rem; font-weight: 600; }
.savs-empty-state p { margin: 0; color: var(--savs-gray); font-size: 0.9rem; }

/* ---------- loading ---------- */
.savs-spinner-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}
.savs-spinner {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 4px solid var(--savs-primary-light);
  border-top-color: var(--savs-primary);
  animation: savs-spin 0.75s linear infinite;
}
.savs-spinner-overlay p { margin: 1rem 0 0; color: var(--savs-gray); }
@keyframes savs-spin { to { transform: rotate(360deg); } }

/* ---------- modals ---------- */
.savs-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(32, 34, 59, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.savs-modal-content {
  border-radius: 20px;
  border: none;
  overflow: hidden;
  background: var(--savs-white);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
.savs-modal-video { max-width: 1140px; }
.savs-modal-upgrade { max-width: 800px; }
.savs-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: none;
}
.savs-modal-video .savs-modal-header { padding: 1.25rem 1.5rem; }
.savs-modal-upgrade .savs-modal-header { padding: 1.25rem 1.5rem 0.75rem; }
.savs-modal-title { font-weight: 600; font-size: 1.1rem; margin: 0; }
.savs-modal-upgrade .savs-modal-title { font-weight: 700; font-size: 1.6rem; color: var(--savs-dark); }
.savs-modal-video .savs-modal-body { padding: 0 1.5rem 1.5rem; }
.savs-modal-upgrade .savs-modal-body { background: #f4f1fb; padding: 1.5rem; }

.savs-btn-close {
  border: 0;
  background: transparent;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--savs-gray);
}
.savs-btn-close:hover { background: var(--savs-light-gray); color: var(--savs-dark); }
.savs-upgrade-close-btn {
  background: #d92d2d;
  color: #fff;
  border: none;
  border-radius: 10px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  flex: none;
}
.savs-upgrade-close-btn:hover { background: #bf2323; color: #fff; }
.savs-btn-close:focus-visible, .savs-upgrade-close-btn:focus-visible {
  outline: 2px solid var(--savs-primary);
  outline-offset: 2px;
}

.savs-frame { position: relative; padding-top: 56.25%; }
.savs-frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  border: none;
}

/* ---------- plan option list ---------- */
.savs-plan-option-list { display: flex; flex-direction: column; gap: 1rem; }
.savs-plan-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--savs-white);
  border: 2px solid transparent;
  border-radius: 14px;
  padding: 1.1rem 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  text-align: left;
  font-family: inherit;
  width: 100%;
}
.savs-plan-option:hover { border-color: #e0daf4; }
.savs-plan-option.savs-selected {
  border-color: var(--savs-primary);
  box-shadow: 0 2px 12px rgba(66, 0, 131, 0.10);
}
.savs-plan-option:focus-visible {
  outline: none;
  border-color: var(--savs-primary);
  box-shadow: 0 0 0 3px rgba(66, 0, 131, 0.15);
}
.savs-plan-radio {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 50%;
  background: #b9b9c4;
  display: flex;
  align-items: center;
  justify-content: center;
}
.savs-plan-option.savs-selected .savs-plan-radio {
  background: transparent;
  border: 2px solid var(--savs-primary);
}
.savs-plan-option.savs-selected .savs-plan-radio::after {
  content: '';
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--savs-primary);
}
.savs-plan-info { flex: 1; min-width: 0; }
.savs-plan-name { font-weight: 700; color: var(--savs-primary); font-size: 1.2rem; margin-bottom: 2px; }
.savs-plan-desc { color: var(--savs-gray); font-size: 0.9rem; margin: 0; }
.savs-plan-desc strong { color: var(--savs-primary); font-weight: 700; }
.savs-plan-amount { font-weight: 700; font-size: 1.35rem; color: var(--savs-dark); white-space: nowrap; }

.savs-select-wrap { text-align: center; margin-top: 1.5rem; }
.savs-upgrade-select-btn {
  border-radius: 10px;
  font-weight: 700;
  background: var(--savs-primary);
  color: #fff;
  padding: 0.65rem 2.25rem;
  font-size: 1rem;
  display: inline-block;
  text-decoration: none;
  font-family: inherit;
  border: 0;
  cursor: pointer;
}
.savs-upgrade-select-btn:hover { background: var(--savs-primary-dark); color: #fff; }
.savs-upgrade-select-btn.savs-disabled { opacity: 0.55; pointer-events: none; }
.savs-plan-note {
  border-radius: 12px;
  background: #fff8e6;
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

/* ---------- footer ---------- */
.savs-foot {
  margin-top: 1.5rem;
  font-size: 13px;
  color: var(--savs-gray);
}
.savs-foot a { color: var(--savs-primary); }

/* ---------- responsive ---------- */
@media (max-width: 992px) {
  .savs-grid-stats { grid-template-columns: repeat(2, 1fr); }
  .savs-grid-charts { grid-template-columns: 1fr; }
  .savs-grid-videos { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .savs-filters-row { flex-wrap: wrap; gap: 0.5rem; }
  .savs-header-right { width: 100%; justify-content: flex-start; }
  .savs-grid-videos { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 576px) {
  .savs-root { padding: 0.75rem; }
  .savs-stat-card { padding: 1rem; }
  .savs-stat-value { font-size: 24px; }
  .savs-circular-progress { width: 140px; height: 140px; }
  .savs-circular-progress .savs-pct { font-size: 28px; }
  .savs-video-container { padding: 1rem; }
  .savs-page-header h1 { font-size: 1.3rem; }
  .savs-domain { margin-left: 0; }
  .savs-plan-option { flex-wrap: wrap; padding: 1rem; }
  .savs-plan-amount { width: 100%; text-align: left; padding-left: 38px; }
}
@media (prefers-reduced-motion: reduce) {
  .savs-root *, .savs-root *::before, .savs-root *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`

export default STYLES
