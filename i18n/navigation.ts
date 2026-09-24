import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware wrappers around next/link and friends: `<Link href="/docs">`
// resolves to `/docs` in English and `/de/docs` in German.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
