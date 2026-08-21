import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — update your Mac apps the way they expect`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card is rendered at build time, so reading the icon off disk here costs
// nothing at request time. It is the app's own icon rather than a wordmark: the
// icon is what people will have seen in their menu bar.
const icon = readFileSync(join(process.cwd(), "assets", "icon.png"));
const iconDataURI = `data:image/png;base64,${icon.toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#131312",
          color: "#ececea",
          fontFamily:
            'ui-sans-serif, -apple-system, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconDataURI} width={132} height={132} alt="" />
        <div
          style={{
            marginTop: 44,
            fontSize: 62,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            display: "flex",
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 30,
            lineHeight: 1.35,
            color: "#a0a09a",
            maxWidth: 880,
            display: "flex",
          }}
        >
          Finds updates for the apps you already have, and installs them the way
          each app expects to be updated.
        </div>
      </div>
    ),
    size,
  );
}
