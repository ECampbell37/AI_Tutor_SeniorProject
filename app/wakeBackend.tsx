// Wakes up the backend server on page load

"use client";

import { useEffect } from "react";

export default function WakeBackend() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_PYTHON_API;

    // If the env var isn't set, don't do anything
    if (!base) return;

    // Fire-and-forget: don't block rendering
    fetch(`${base}/health`, {
      method: "GET",
      cache: "no-store",
    }).catch(() => {});
  }, []);

  return null;
}
