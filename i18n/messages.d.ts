import type en from "../messages/en.json";
import type { routing } from "./routing";

// English is the source: a key used in code but missing from en.json is a type
// error. (The other languages are checked against it in messages.check.ts.)
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
