"use client";

import { useEffect, useRef, useState } from "react";

// A shell command with a button that copies it. The labels come in as props so
// the parent server component keeps owning the translations. Where the
// clipboard API is unavailable (an http page, a refused permission) the button
// selects the command instead, so ⌘C still finishes the job.
export default function CopyCommand({
  command,
  copyLabel,
  copiedLabel,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const code = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      if (code.current) getSelection()?.selectAllChildren(code.current);
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  const label = copied ? copiedLabel : copyLabel;
  return (
    <span className="copy-command">
      <code ref={code}>{command}</code>
      <button type="button" onClick={copy} aria-label={label} title={label} data-copied={copied || undefined}>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
          {copied ? (
            <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          ) : (
            <>
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          )}
        </svg>
      </button>
      <span className="copy-status" role="status">
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
