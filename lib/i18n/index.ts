import { de } from "./de";
import { en, type Messages } from "./en";
import { es } from "./es";
import { it } from "./it";
import { ja } from "./ja";
import type { LocaleSegment } from "./locales";
import { ptbr } from "./pt-br";
import { tr } from "./tr";
import { zhhant } from "./zh-hant";

export type { Messages, Rich } from "./en";

const MESSAGES: Record<LocaleSegment, Messages> = {
  de,
  es,
  it,
  "pt-br": ptbr,
  tr,
  ja,
  "zh-hant": zhhant,
};

export function messagesFor(segment: LocaleSegment | ""): Messages {
  return segment ? MESSAGES[segment] : en;
}
