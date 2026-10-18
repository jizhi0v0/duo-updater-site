import { siApple, siElectron, siFlutter, siQt, siTauri } from "simple-icons";

import type { AppStrings, Runtime } from "@/lib/demo";

// The mark beside an app's name, as the app's RuntimeTag draws it: the runtime's
// own Simple Icons artwork filled with a system hue (demo.css), and Apple's logo
// for a native app.
export const RUNTIMES: Record<
  Runtime,
  { path: string; label: (s: AppStrings) => string; detail: string }
> = {
  electron: {
    path: siElectron.path,
    label: () => "Electron",
    detail: "Built with Electron — it bundles its own copy of Chromium.",
  },
  tauri: {
    path: siTauri.path,
    label: () => "Tauri",
    detail: "Built with Tauri — a Rust app drawing into the system WebView.",
  },
  flutter: {
    path: siFlutter.path,
    label: () => "Flutter",
    detail: "Built with Flutter.",
  },
  qt: {
    path: siQt.path,
    label: () => "Qt",
    detail: "Built with Qt.",
  },
  native: {
    path: siApple.path,
    label: (s) => s.Native as string,
    detail: "A native Mac app — built straight on Apple's frameworks, not a cross-platform runtime.",
  },
};

export function RuntimeGlyph({ runtime, size }: { runtime: Runtime; size: number }) {
  const mark = RUNTIMES[runtime];
  return (
    <svg
      className={`pd-runtime pd-runtime-${runtime}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={mark.path} />
    </svg>
  );
}
