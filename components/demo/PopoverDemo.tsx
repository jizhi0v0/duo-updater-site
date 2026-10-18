"use client";

import {
  AppWindow,
  ArrowRight,
  ChartNoAxesColumn,
  Coffee,
  History,
  Power,
  RefreshCw,
  RotateCw,
  Search,
  Settings,
  Sparkles,
  SquareTerminal,
  Check,
  CircleCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AppString, AppStrings, DemoApp, DemoData } from "@/lib/demo";

import { RUNTIMES, RuntimeGlyph } from "./RuntimeMark";
import { useLiquidGlass } from "./useLiquidGlass";

import "./demo.css";

// A working copy of DuoUpdater's menu-bar popover (App/Sources/MenuContentView.swift),
// at its own sizes and in its own words: the rows, the search, the runtime marks
// and the install sequence behave as the app's do, on apps and versions the CLI
// reported on the day of the last sync. Nothing here touches the visitor's Mac.

type InstallStage = "Queued" | "Checking" | "Verifying" | "Extracting" | "Installing";
type RowState =
  | { kind: "pending" }
  | { kind: "queued" }
  | { kind: "downloading"; fraction: number }
  | { kind: "stage"; stage: InstallStage }
  | { kind: "updated" };
type ToolState = "pending" | "running" | "done";

/** How many installs run at once; the rest wait as "Queued", as the app's queue does. */
const CONCURRENT_INSTALLS = 3;
const REFRESH_MS = 1400;

/** Case, diacritics and width folded, like the app's SearchMatch. */
function fold(text: string) {
  return text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}

/** A stable per-app duration, so the same row always downloads at the same pace. */
function downloadMillis(app: DemoApp) {
  let hash = 0;
  for (const char of app.bundleID) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 1300 + (hash % 1300);
}

export default function PopoverDemo({
  data,
  strings,
  languageTag,
}: {
  data: DemoData;
  strings: AppStrings;
  languageTag: string;
}) {
  const plural = useMemo(() => new Intl.PluralRules(languageTag), [languageTag]);
  const t = useCallback(
    (key: string, n?: number, s?: string) => {
      const entry: AppString | undefined = strings[key];
      let text: string;
      if (entry === undefined) text = key;
      else if (typeof entry === "string") text = entry;
      else text = entry[plural.select(n ?? 0)] ?? entry.other ?? key;
      return text.replace("{n}", String(n ?? "")).replace("{s}", s ?? "");
    },
    [strings, plural],
  );

  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [brew, setBrew] = useState<ToolState>(data.homebrewUpdates > 0 ? "pending" : "done");
  const [tools, setTools] = useState<ToolState>(data.otherToolUpdates > 0 ? "pending" : "done");
  const [detail, setDetail] = useState<{ app: DemoApp; x: number; y: number } | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const queue = useRef<DemoApp[]>([]);
  const active = useRef(0);

  // The panel is frosted like the app's popover material, so most of the look
  // is the pre-blur; the bend shows at the rim. The runtime card is clearer glass.
  useLiquidGlass(panelRef, { radius: 18, bezelWidth: 18, glassThickness: 70, blur: 14, saturation: 1.7, specularSlope: 0.6 });
  useLiquidGlass(bubbleRef, { radius: 14, bezelWidth: 14, glassThickness: 50, blur: 3, saturation: 1.5 }, detail !== null);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const after = useCallback((ms: number, run: () => void) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      run();
    }, ms);
    timers.current.add(id);
  }, []);

  const setRow = useCallback((id: string, state: RowState) => {
    setRows((current) => ({ ...current, [id]: state }));
  }, []);

  // download → verify → extract → install → done: InstallStage in the app's core,
  // and the labels its row shows for each (installStageLabel).
  const runInstall = useCallback(
    (app: DemoApp) => {
      active.current += 1;
      const total = downloadMillis(app);
      const started = performance.now();
      setRow(app.bundleID, { kind: "stage", stage: "Checking" });
      const tick = () => {
        const fraction = Math.min(1, (performance.now() - started - 300) / total);
        if (fraction < 1) {
          setRow(app.bundleID, { kind: "downloading", fraction: Math.max(0, fraction) });
          after(60, tick);
          return;
        }
        setRow(app.bundleID, { kind: "stage", stage: "Verifying" });
        after(550, () => {
          setRow(app.bundleID, { kind: "stage", stage: "Extracting" });
          after(400, () => {
            setRow(app.bundleID, { kind: "stage", stage: "Installing" });
            after(600, () => {
              setRow(app.bundleID, { kind: "updated" });
              active.current -= 1;
              const next = queue.current.shift();
              if (next) runInstall(next);
            });
          });
        });
      };
      after(300, tick);
    },
    [after, setRow],
  );

  const install = useCallback(
    (app: DemoApp) => {
      if (active.current >= CONCURRENT_INSTALLS) {
        queue.current.push(app);
        setRow(app.bundleID, { kind: "queued" });
      } else {
        runInstall(app);
      }
    },
    [runInstall, setRow],
  );

  const stateOf = (app: DemoApp): RowState => rows[app.bundleID] ?? { kind: "pending" };
  const waiting = data.apps.filter((app) => app.hasUpdate && stateOf(app).kind === "pending");
  const outstanding = data.apps.filter((app) => app.hasUpdate && stateOf(app).kind !== "updated");

  const runTool = (set: (state: ToolState) => void) => {
    set("running");
    after(2400, () => set("done"));
  };

  const updateAll = () => {
    waiting.forEach(install);
    if (brew === "pending") runTool(setBrew);
    if (tools === "pending") runTool(setTools);
  };

  const refresh = () => {
    if (refreshing) return;
    setDetail(null);
    setRefreshing(true);
    after(REFRESH_MS, () => setRefreshing(false));
  };

  const searching = query.trim().length > 0;
  const visible = data.apps.filter((app) => {
    // A row that has just been updated stays until the next look, as in the app.
    if (!showAll && !app.hasUpdate) return false;
    if (!searching) return true;
    const needle = fold(query.trim());
    return fold(app.name).includes(needle) || fold(app.bundleID).includes(needle);
  });

  const statusBase = refreshing
    ? t("Checking %lld apps…", data.apps.length)
    : outstanding.length > 0
      ? t("%lld updates available", outstanding.length)
      : t("%lld apps · up to date", data.apps.length);
  const statusLine = refreshing ? statusBase : `${statusBase} · ${t("just now")}`;
  const canUpdateAll = waiting.length > 0 || brew === "pending" || tools === "pending";

  // The runtime card closes the way a macOS popover does: a click elsewhere,
  // Escape, or the list moving out from under it.
  useEffect(() => {
    if (!detail) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event.target instanceof Node && bubbleRef.current?.contains(event.target)) return;
      if (event.target instanceof Element && event.target.closest(".pd-mark")) return;
      setDetail(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [detail]);

  const openDetail = (app: DemoApp, target: HTMLElement) => {
    if (detail?.app.bundleID === app.bundleID) {
      setDetail(null);
      return;
    }
    const panel = panelRef.current?.getBoundingClientRect();
    const mark = target.getBoundingClientRect();
    if (!panel) return;
    setDetail({ app, x: mark.left + mark.width / 2 - panel.left, y: mark.bottom - panel.top });
  };

  const badge = outstanding.length;

  return (
    <div className="pd-desktop">
      <div className="pd-menubar" aria-hidden="true">
        <span className="pd-menubar-apple">
          <svg viewBox="0 0 24 24" width="13" height="13">
            <path d={RUNTIMES.native.path} />
          </svg>
        </span>
        <span className="pd-menubar-spacer" />
        <span className="pd-menubar-item pd-menubar-item-open">
          {badge > 0 ? (
            <span className="pd-badge">{Math.min(badge, 99)}</span>
          ) : (
            <RefreshCw size={14} strokeWidth={2} />
          )}
        </span>
      </div>

      <div className="pd-panel" ref={panelRef} role="region" aria-label="DuoUpdater">
        <div className="pd-content">
          <header className="pd-header">
            <div className="pd-title-row">
              <div className="pd-title">
                <span className="pd-name">DuoUpdater</span>
                <span className="pd-self" title={t("What's New — DuoUpdater's own release notes")}>
                  v{data.selfVersion}
                  <Sparkles size={10} strokeWidth={2} />
                </span>
              </div>
              <div className="pd-header-tools">
                <button
                  type="button"
                  className="pd-icon-button"
                  onClick={refresh}
                  disabled={refreshing}
                  title={t("Rescan and check for updates")}
                  aria-label={t("Rescan and check for updates")}
                >
                  {refreshing ? <Spinner /> : <RotateCw size={14} strokeWidth={1.8} />}
                </button>
                <span className="pd-icon-static" title={t("Settings")}>
                  <Settings size={14} strokeWidth={1.8} />
                </span>
              </div>
            </div>
            <div className="pd-status-row">
              <span className="pd-status" title={statusLine} aria-live="polite">
                {statusLine}
              </span>
              {canUpdateAll ? (
                <button type="button" className="pd-button" onClick={updateAll}>
                  {t("Update All")}
                </button>
              ) : (
                <span className="pd-button-placeholder" />
              )}
            </div>
          </header>

          <div className="pd-search">
            <Search size={13} strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder={t("Search apps")}
              aria-label={t("Search apps")}
              onChange={(event) => {
                setQuery(event.target.value);
                setDetail(null);
              }}
            />
          </div>

          {visible.length === 0 ? (
            <div className="pd-empty">
              <Search size={30} strokeWidth={1.6} aria-hidden="true" />
              <p className="pd-empty-title">{t("noResults", undefined, query.trim())}</p>
              <p className="pd-empty-hint">{t("noResultsHint")}</p>
            </div>
          ) : (
            <ul className="pd-list" onScroll={() => setDetail(null)}>
              {visible.map((app) => (
                <AppRow
                  key={app.bundleID}
                  app={app}
                  state={stateOf(app)}
                  t={t}
                  onUpdate={() => install(app)}
                  onMark={(target) => openDetail(app, target)}
                  markOpen={detail?.app.bundleID === app.bundleID}
                />
              ))}
            </ul>
          )}

          <div className="pd-cli">
            {data.homebrewUpdates > 0 && (
              <ToolRow
                icon={<Coffee size={15} strokeWidth={1.6} />}
                title="Homebrew"
                state={brew}
                pending={t("%lld updates", data.homebrewUpdates)}
                running={t("Running brew upgrade…")}
                done={t("Up to date")}
                t={t}
                onUpdate={() => runTool(setBrew)}
              />
            )}
            {data.otherToolUpdates > 0 && (
              <ToolRow
                icon={<SquareTerminal size={15} strokeWidth={1.6} />}
                title={t("Other tools")}
                state={tools}
                pending={t("%lld updates", data.otherToolUpdates)}
                running={t("Installing")}
                done={t("Up to date")}
                t={t}
                onUpdate={() => runTool(setTools)}
              />
            )}
          </div>

          <footer className="pd-footer">
            <label className="pd-checkbox">
              <input type="checkbox" checked={showAll} onChange={(event) => setShowAll(event.target.checked)} />
              <span className="pd-checkbox-box" aria-hidden="true">
                <Check size={10} strokeWidth={3.2} />
              </span>
              {t("Show all")}
            </label>
            <span className="pd-footer-tools">
              <span className="pd-icon-static" title={t("Release Log — when the apps you track shipped each version")}>
                <History size={13} strokeWidth={1.8} />
              </span>
              <span
                className="pd-icon-static"
                title={t("Network — what keeping these apps updated has cost, and every request behind it")}
              >
                <ChartNoAxesColumn size={13} strokeWidth={1.8} />
              </span>
              <span className="pd-icon-static" title={t("Open Window — release notes and settings")}>
                <AppWindow size={13} strokeWidth={1.8} />
              </span>
              <span className="pd-icon-static" title={t("Quit")}>
                <Power size={13} strokeWidth={1.8} />
              </span>
            </span>
          </footer>
        </div>

        {detail && (
          <div
            className="pd-bubble"
            ref={bubbleRef}
            role="dialog"
            aria-label={RUNTIMES[detail.app.runtime].label(strings)}
            style={{ left: detail.x, top: detail.y + 8 }}
          >
            <div className="pd-bubble-body">
              <RuntimeGlyph runtime={detail.app.runtime} size={26} />
              <div>
                <p className="pd-bubble-title">{RUNTIMES[detail.app.runtime].label(strings)}</p>
                <p className="pd-bubble-text">{t(RUNTIMES[detail.app.runtime].detail)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Translate = (key: string, n?: number, s?: string) => string;

function AppRow({
  app,
  state,
  t,
  onUpdate,
  onMark,
  markOpen,
}: {
  app: DemoApp;
  state: RowState;
  t: Translate;
  onUpdate: () => void;
  onMark: (target: HTMLElement) => void;
  markOpen: boolean;
}) {
  const runtimeLabel = RUNTIMES[app.runtime].label({ Native: t("Native") });
  return (
    <li className="pd-row">
      {/* eslint-disable-next-line @next/next/no-img-element -- 64px PNGs, already the size they are drawn at 2x */}
      <img className="pd-icon" src={app.icon} alt="" width={30} height={30} loading="lazy" />
      <div className="pd-text">
        <div className="pd-name-line">
          <span className="pd-app-name">{app.name}</span>
          <button
            type="button"
            className={`pd-mark${markOpen ? " pd-mark-open" : ""}`}
            onClick={(event) => onMark(event.currentTarget)}
            aria-label={runtimeLabel}
            aria-expanded={markOpen}
          >
            <RuntimeGlyph runtime={app.runtime} size={12} />
          </button>
        </div>
        <div className="pd-version-line">
          {app.hasUpdate && state.kind !== "updated" ? (
            <>
              <span>{app.installed}</span>
              <ArrowRight size={9} strokeWidth={2.4} aria-hidden="true" />
              <span className="pd-version-new">{app.latest}</span>
            </>
          ) : (
            <span>{app.hasUpdate ? app.latest : app.installed}</span>
          )}
        </div>
      </div>
      <div className="pd-action">
        <RowAction app={app} state={state} t={t} onUpdate={onUpdate} />
      </div>
    </li>
  );
}

function RowAction({ app, state, t, onUpdate }: { app: DemoApp; state: RowState; t: Translate; onUpdate: () => void }) {
  if (!app.hasUpdate) {
    return <Check className="pd-current" size={11} strokeWidth={2.4} aria-label={t("Up to date")} />;
  }
  switch (state.kind) {
    case "pending":
      return (
        <button type="button" className="pd-button pd-row-button" onClick={onUpdate}>
          {t("Update")}
        </button>
      );
    case "queued":
      return <StageLabel label={t("Queued")} />;
    case "stage":
      return <StageLabel label={t(state.stage)} />;
    case "downloading":
      return (
        <span className="pd-progress" title={`${Math.floor(state.fraction * 100)}%`}>
          <span className="pd-bar">
            <span className="pd-bar-fill" style={{ transform: `scaleX(${state.fraction})` }} />
          </span>
          <span className="pd-percent">{Math.floor(state.fraction * 100)}%</span>
        </span>
      );
    case "updated":
      return (
        <span className="pd-stage">
          <CircleCheck className="pd-done" size={14} strokeWidth={2.2} aria-hidden="true" />
          <span className="pd-stage-label">{t("Updated")}</span>
        </span>
      );
  }
}

function StageLabel({ label }: { label: string }) {
  return (
    <span className="pd-stage">
      <Spinner />
      <span className="pd-stage-label">{label}</span>
    </span>
  );
}

function ToolRow({
  icon,
  title,
  state,
  pending,
  running,
  done,
  t,
  onUpdate,
}: {
  icon: React.ReactNode;
  title: string;
  state: ToolState;
  pending: string;
  running: string;
  done: string;
  t: Translate;
  onUpdate: () => void;
}) {
  return (
    <div className="pd-tool">
      <span className="pd-tool-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="pd-tool-text">
        <span className="pd-tool-title">{title}</span>
        <span className="pd-tool-status">{state === "pending" ? pending : state === "running" ? running : done}</span>
      </div>
      {state === "pending" && (
        <button type="button" className="pd-button pd-row-button" onClick={onUpdate}>
          {t("Update")}
        </button>
      )}
      {state === "running" && <Spinner />}
    </div>
  );
}

/** AppKit's small indeterminate spinner: twelve fading spokes. */
function Spinner() {
  return (
    <span className="pd-spinner" role="progressbar" aria-busy="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${(i - 12) / 12}s` }} />
      ))}
    </span>
  );
}
