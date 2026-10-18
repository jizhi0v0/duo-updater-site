// The home page's live popover reads two files that `npm run sync` writes from
// the real product (scripts/sync-demo.mjs): the apps it lists, and the app's own
// words for everything it shows. Imported on the server only; a page passes its
// one language down, not all eleven.
import appStrings from "@/content/app-strings.json";
import demo from "@/content/demo-apps.json";
import type { LocaleID } from "@/i18n/locales";

export type Runtime = "electron" | "tauri" | "flutter" | "qt" | "native";

export interface DemoApp {
  bundleID: string;
  name: string;
  runtime: Runtime;
  source: string;
  installed: string;
  latest: string;
  hasUpdate: boolean;
  icon: string;
}

export interface DemoData {
  selfVersion: string;
  apps: DemoApp[];
  homebrewUpdates: number;
  otherToolUpdates: number;
}

/** A catalog entry: plain text, or one text per plural form. */
export type AppString = string | Partial<Record<Intl.LDMLPluralRule, string>>;
export type AppStrings = Record<string, AppString>;

export function demoData(): DemoData {
  return demo as DemoData;
}

export function demoStrings(locale: LocaleID): AppStrings {
  return (appStrings as Record<string, AppStrings>)[locale];
}
